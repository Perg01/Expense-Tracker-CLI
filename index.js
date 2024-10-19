const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const filePath = path.join(__dirname, 'expenses.json');
const { get } = require('http');

const program = new Command();

function addExpense(description, amount) {
    const expenses = getExpense();
    const parsedAmount = amountValidation(amount);

    let nextID = 1;
    while (expenses.find(expense => expense.id === nextID)) {
        nextID++;
    }

    const newExpense = {
        id: nextID,
        description,
        amount: parsedAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    saveExpense(expenses);
    listAllExpenses();
    console.log(`Added expense: ${description} with amount: $${parsedAmount}`);
}

function deleteExpense(id) {
    const expenses = getExpense();
    const newExpeneses = expenses.filter(expense => expense.id !== parseInt(id));
    saveExpense(newExpeneses);
    console.log(`Deleted expense with id: ${id} successfully.`);
}

function updateExpenseDescription(id, description) {
    const expenses = getExpense();
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));

    if (expenseIndex !== -1) {
        expenses[expenseIndex].description = description;
        expenses[expenseIndex].updatedAt = new Date().toISOString();
        saveExpense(expenses);
        console.log(`Updated description for expense with id: ${id} to: ${description}`);
    } else {
        console.error(`Could not find expense with id: ${id}`);
    }
}

function updateExpenseAmount(id, amount) {
    const expenses = getExpense();
    const parsedAmount = amountValidation(amount);
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));

    if (expenseIndex !== -1) {
        expenses[expenseIndex].amount = parsedAmount;
        expenses[expenseIndex].updatedAt = new Date().toISOString();
        saveExpense(expenses);
        console.log(`Updated amount for expense with id: ${id} to: $${parsedAmount}`);
    } else {
        console.error(`Could not find expense with id: ${id}`);
    }
}

function summaryExpenses() {
    const expenses = getExpense();
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    console.log(`Total expenses: $${totalExpenses}`);
}

function monthlySummaryExpenses(month) {
    const expenses = getExpense();

    if (month < 1 || month > 12) {
        console.error("Invalid month. Month must be between 1 and 12.");
        return;
    } else {
        const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.createdAt);
            const expenseMonth = expenseDate.getMonth();
            return expenseMonth === month - 1;
        });

        const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
        console.log(`Total expenses for month ${month}: $${totalExpenses}`);

    }
}

function listAllExpenses() {
    const expenses = getExpense();
    expenses.forEach(expense => {
        console.log('ID:', expense.id);
        console.log('Description:', expense.description);
        console.log('Amount: $', expense.amount);
        console.log('Created At:', expense.createdAt.split('T')[0]);
        console.log('Updated At:', expense.updatedAt.split('T')[0]);
        console.log('---------------------');
        console.log('');
    });
}

function saveExpense(expense) {
    fs.writeFileSync(filePath, JSON.stringify(expense, null, 2));
}

function getExpense() {
    try {
        const expenses = fs.readFileSync(filePath, 'utf8');
        if (expenses.trim() === '') {
            return [];
        }
        return JSON.parse(expenses);
    }
    catch (err) {
        console.error("Something went wrong while reading expenses file: ", err);
        return [];
    }
}

function amountValidation(amount) {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount. Amount must be a positive number.");
    } else {
        return parsedAmount;
    }
}

// Add command
program
    .command('add')
    .description('Add a new expense')
    .option('--description <desc>', 'Description of the expense')
    .option('--amount <amt>', 'Expense amount')
    .action((options) => {
        const { description, amount } = options;
        if (description && amount) {
            addExpense(description, amount);
        } else {
            console.error('Please provide BOTH the description and amount.');
        }
    });

// Update Description command
program
    .command('update-description')
    .description('Update the description of an expense')
    .option('--id <id>', 'ID of the expense to be updated')
    .option('--description <desc>', 'New description of the expense')
    .action((options) => {
        const { id, description } = options;
        if (id && description) {
            updateExpenseDescription(id, description);
        } else {
            console.error('Please provide BOTH the ID and description.');
        }
    });

// Update Amount command
program
    .command('update-amount')
    .description('Update the amount of an expense')
    .option('--id <id>', 'ID of the expense to be updated')
    .option('--amount <amount>', 'New amount of the expense')
    .action((options) => {
        const { id, amount } = options;
        if (id && amount) {
            updateExpenseAmount(id, amount);
        } else {
            console.error('Please provide BOTH the ID and amounts.');
        }
    });

// Delete command
program
    .command('delete')
    .description('Delete an expense')
    .option('--id <id>', 'ID of the expense to be deleted')
    .action((options) => {
        const { id } = options;
        if (id) {
            deleteExpense(id);
        } else {
            console.error('Please provide a valid expense ID.');
        }
    });

// List command
program
    .command('list')
    .description('List all expenses')
    .action(() => {
        listAllExpenses();
    });

// Summary command
program
    .command('summary')
    .description('Summary of all expenses')
    .action(() => {
        summaryExpenses();
    });

// Specific Month Summary command
program
    .command('summary-month')
    .description('Summary of a specific month in current year')
    .option('--month <month>', 'Month to be summarized')
    .action((options) => {
        const { month } = options;
        if (month) {
            monthlySummaryExpenses(month);
        } else {
            console.error('Please provide a valid month.');
        }
    });

program
    .command('help')
    .description('Display help information')
    .action(() => {
        console.log('Available commands:');
        console.log('add: Add a new expense');
        console.log('Example: add --description "New Expense" --amount 100');
        console.log('');
        console.log('update-description: Update the description of an expense');
        console.log('Example: update-description --id 1 --description "Updated Description"');
        console.log('');
        console.log('update-amount: Update the amount of an expense');
        console.log('Example: update-amount --id 1 --amount 200');
        console.log('');
        console.log('delete: Delete an expense');
        console.log('list: List all expenses');
        console.log('summary: Summary of all expenses');
        console.log('summary-month: Summary of a specific month in current year');
        console.log('Example: summary-month --month 4');
        console.log('');
    });

program.parse(process.argv);