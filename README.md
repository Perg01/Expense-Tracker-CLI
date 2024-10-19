# Expense Tracker CLI

A simple command-line application to manage your expenses. You can add, update, delete, list, and summarize your expenses, all stored in a JSON file.

## Features

<ul>
  <li>Add a new expense with a description and amount.</li>
  <li>Update the description or amount of an existing expense.</li>
  <li>Delete an expense by ID.</li>
  <li>List all expenses.</li>
  <li>View a summary of all expenses.</li>
  <li>View a summary of expenses for a specific month (current year).</li>
</ul>

## Installation

<pre><code>npm install</code></pre>

## Usage

### 1. Add an Expense

<pre><code>node expense-tracker add --description "Lunch" --amount 20</code></pre>

This will add an expense with a description of "Lunch" and an amount of 20.

### 2. Update an Expense's Description

<pre><code>node expense-tracker update-description --id 1 --description "Dinner"</code></pre>

This updates the description of the expense with ID 1 to "Dinner".

### 3. Update an Expense's Amount

<pre><code>node expense-tracker update-amount --id 1 --amount 25</code></pre>

This updates the amount of the expense with ID 1 to 25.

### 4. Delete an Expense

<pre><code>node expense-tracker delete --id 1</code></pre>

This deletes the expense with ID 1.

### 5. List All Expenses

<pre><code>node expense-tracker list</code></pre>

This lists all the saved expenses.

### 6. View a Summary of All Expenses

<pre><code>node expense-tracker summary</code></pre>

This shows the total amount of all expenses.

### 7. View a Summary for a Specific Month

<pre><code>node expense-tracker summary-month --month 8</code></pre>

This shows the total expenses for August (month 8).

## Commands Overview

<ul>
  <li><b>add</b>: Adds a new expense. Use <code>--description</code> and <code>--amount</code>.</li>
  <li><b>update-description</b>: Updates the description of an expense by ID. Use <code>--id</code> and <code>--description</code>.</li>
  <li><b>update-amount</b>: Updates the amount of an expense by ID. Use <code>--id</code> and <code>--amount</code>.</li>
  <li><b>delete</b>: Deletes an expense by ID. Use <code>--id</code>.</li>
  <li><b>list</b>: Lists all expenses.</li>
  <li><b>summary</b>: Shows the total of all expenses.</li>
  <li><b>summary-month</b>: Shows the total of expenses for a specific month. Use <code>--month</code>.</li>
</ul>

## Example

<pre><code>node expense-tracker add --description "Groceries" --amount 50
node expense-tracker update-description --id 1 --description "Weekly Groceries"
node expense-tracker list
node expense-tracker summary</code></pre>

## Error Handling

<ul>
  <li>If the amount is not a valid positive number, the program will display an error.</li>
  <li>If an invalid expense ID is provided for updating or deleting, the program will inform you that the ID does not exist.</li>
</ul>

## License

This project is licensed under the MIT License.
