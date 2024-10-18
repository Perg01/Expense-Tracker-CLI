const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const filePath = path.join(__dirname, 'expenses.json');
const { get } = require('http');

const program = new Command();

// program
//     .option('-a, --add', 'Add an expense')
//     .option('-l, --list', 'List all expenses')
//     .option('-d, --delete <id>', 'Delete an expense')
//     .parse(process.argv);

// program.on('--help', function () {
//     console.log('');
//     console.log('  Examples:');
//     console.log('');
//     console.log('    $ node index.js --add "Pay electric bill"');
//     console.log('    $ node index.js --list');
//     console.log('    $ node index.js --delete 1');
// });

function addExpense(description, amount) {
    const expenses = getExpense();
    const parsedAmount = amountValidation(amount);

    const newExpense = {
        id: expenses.length + 1,
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

// Update command

// Delete command

// List command

program.parse(process.argv);