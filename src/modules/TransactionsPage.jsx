import React, { useState } from "react";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");

  const expenseCategories = ["Food", "Transportation", "Utilities"];
  const incomeCategories = ["Salary", "Freelance", "Investments"];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function getCurrentMonthYear() {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  }

  const handleAmountChange = (event) => {
    const formattedAmount = event.target.value
      .replace(/[^\d.]/g, "") // Remove non-numeric characters except periods
      .replace(/(\..*)\./g, "$1") // Remove multiple periods
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // Add commas
    setAmount(formattedAmount);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedCategory && amount) {
      const newTransaction = {
        category: selectedCategory,
        amount: parseFloat(amount.replace(/,/g, "")), // Remove commas before parsing
        type: transactionType,
        date: new Date().toLocaleDateString(),
      };

      setTransactions([...transactions, newTransaction]);
      setSelectedCategory("");
      setAmount("");
    }
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const totalBalance = parseFloat(totalIncome) - parseFloat(totalExpenses);

  const categories =
    transactionType === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h3>
          Total Balance: $
          {totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h3>
        <h4>
          Total Income: $
          {totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h4>
        <h4>
          Total Expenses: -$
          {totalExpenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h4>
      </div>
      <div className="mb-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type:</label>
            <select
              value={transactionType}
              onChange={(e) => {
                setTransactionType(e.target.value);
                setSelectedCategory("");
              }}
              className="form-control"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-control"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="form-control"
              placeholder="Enter amount"
              disabled={!selectedCategory} // Disable when no category selected
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedCategory || !amount}
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
      <div className="mb-4">
        <h3>Transaction history {getCurrentMonthYear()}:</h3>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td
                className={
                  transaction.type === "expense" ? "expense" : "income"
                }
              >
                {transaction.type === "expense" ? "-" : ""}$
                {parseFloat(transaction.amount).toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.type}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTransaction(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;
