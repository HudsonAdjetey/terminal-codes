#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv"); // Fixed case from 'Parse' to 'Parser'
const program = new Command();

const expensesPath = path.join(__dirname, "expenses.json");
const budgetPath = path.join(__dirname, "budget.json");

// Helper function to read expenses
const readExpenses = () => {
  if (!fs.existsSync(expensesPath)) {
    return [];
  }
  const content = fs.readFileSync(expensesPath, "utf8");
  return JSON.parse(content || "[]");
};

// Write expenses to file
const writeExpenses = (expenses) => {
  fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2));
};

// Helper function to read budget
const readBudget = () => {
  if (!fs.existsSync(budgetPath)) {
    return {};
  }
  const content = fs.readFileSync(budgetPath, "utf8");
  return JSON.parse(content || "{}");
};

// Write budget to file
const writeBudget = (budget) => {
  fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));
};

// Add a new expense
program
  .command("add")
  .description("Add a new expense")
  .requiredOption("--description <description>", "Description of your expense")
  .requiredOption("--amount <amount>", "Amount of the expense")
  .option("--category <category>", "Category of the expenses", "Uncategorized")
  .action((options) => {
    const { description, amount, category } = options;
    const expenses = readExpenses();
    const newExpense = {
      id: expenses.length ? Math.max(...expenses.map((e) => e.id)) + 1 : 1,
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    expenses.push(newExpense);
    writeExpenses(expenses);

    // Update budget
    const budget = readBudget();
    const currentMonth = new Date().getMonth() + 1;
    const currentBudget = budget[currentMonth] || 0;
    const totalExpenses = expenses.reduce(
      (acc, expense) =>
        acc +
        (new Date(expense.date).getMonth() + 1 === currentMonth
          ? expense.amount
          : 0),
      0
    );

    // Update budget
    if (currentBudget >= totalExpenses) {
      budget[currentMonth] = currentBudget - newExpense.amount;
      writeBudget(budget);
      console.log("Budget updated successfully!");
    } else {
      console.warn("Total expenses exceed the budget!");
    }
    console.log(`Expense added successfully - ID: ${newExpense.id}`);
  });

// List all expenses
program
  .command("list")
  .description("List all expenses")
  .option("--category <category>", "Get expenses by category")
  .action((options) => {
    const { category } = options;
    const expenses = readExpenses();
    const filteredExpenses = category
      ? expenses.filter((expense) => expense.category === category)
      : expenses;

    if (filteredExpenses.length === 0) {
      console.log("No expenses found!");
      return;
    }

    const fields = [
      "id",
      "description",
      "amount",
      "category",
      "date",
      "updatedAt",
    ];
    const csvParser = new Parser({ fields });
    const csv = csvParser.parse(filteredExpenses);
    console.log(csv);

    const totalAmount = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    console.log(`Total expenses: $${totalAmount.toFixed(2)}`);
  });

// Delete an expense
program
  .command("delete")
  .description("Delete an expense")
  .requiredOption("--id <id>", "ID of the expense to delete")
  .action((options) => {
    const { id } = options;
    const expenses = readExpenses();
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== parseInt(id)
    );

    if (updatedExpenses.length === expenses.length) {
      console.log("No expenses found with the given ID!");
      return;
    }

    writeExpenses(updatedExpenses);
    console.log("Expense deleted successfully!");
  });

// Summary of expenses
program
  .command("summary")
  .description("Summary of all expenses")
  .option(
    "--month <month>",
    "View the summary based on specific month of the year"
  )
  .action((options) => {
    const { month } = options;
    const allExpenses = readExpenses();
    const currentMonth = month ? parseInt(month, 10) : null;
    let total = 0;

    allExpenses.forEach((expense) => {
      const expenseMonth = new Date(expense.date).getMonth() + 1;
      if (!currentMonth || currentMonth === expenseMonth) {
        total += expense.amount;
      }
    });

    console.log(
      `Total expenses for ${
        currentMonth ? `Month ${currentMonth}` : "All Months"
      }: $${total.toFixed(2)}`
    );
  });

// Set a monthly budget
program
  .command("budget")
  .description("Set a monthly budget")
  .requiredOption("--amount <amount>", "Budget amount")
  .action((options) => {
    const { amount } = options;
    const budgets = readBudget();
    const currentMonth = new Date().getMonth() + 1;
    budgets[currentMonth] = parseFloat(amount);
    writeBudget(budgets);
    console.log("Budget set successfully!");
  });

// Export expenses to CSV
program
  .command("export")
  .description("Export expenses to CSV")
  .action(() => {
    const expenses = readExpenses();
    const fields = [
      "id",
      "description",
      "amount",
      "category",
      "date",
      "updatedAt",
    ];
    const csvParser = new Parser({ fields });
    const csv = csvParser.parse(expenses);
    fs.writeFileSync("expenses.csv", csv);
    console.log("Expenses exported to expenses.csv");
  });

// Parse the command line arguments
program.parse(process.argv);
