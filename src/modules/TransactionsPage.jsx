import React, { useState } from "react";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterType, setFilterType] = useState("All");

  const expenseCategories = [
    "Food",
    "Transportation",
    "Utilities",
    "Housing",
    "Insurances",
    "Medical",
    "Debt",
    "Entertainment",
    "Shopping",
    "Personal Care",
    "Education",
    "Travel",
    "Donations",
    "Other expense",
  ];
  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Other income",
  ];

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

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredTransactions =
    filterType === "All"
      ? transactions
      : transactions.filter((transaction) => transaction.type === filterType);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const totalBalance = parseFloat(totalIncome) - parseFloat(totalExpenses);

  const categories =
    transactionType === "Expense" ? expenseCategories : incomeCategories;

  const filterTypes = [
    { label: "All", className: "btn-primary" },
    { label: "Income", className: "btn-success" },
    { label: "Expense", className: "btn-danger" },
  ];

  return (
    <div className="container mt-5 static-content">
      <div className="mb-4">
        <h2
          className={
            totalBalance > 0
              ? "Income"
              : totalBalance < 0
              ? "Expense"
              : "Neutral"
          }
        >
          Total Balance: $
          {totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h2>
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
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
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
      <h4>Transaction history {getCurrentMonthYear()}:</h4>
      <table className="table">
        <thead>
          <tr>
            <th colSpan="5" className="text-center">
              {filterTypes.map((filter) => (
                <button
                  key={filter.label}
                  className={`btn ${
                    filterType === filter.label ? filter.className : "btn-light"
                  }`}
                  onClick={() => handleFilterChange(filter.label)}
                >
                  {filter.label}
                </button>
              ))}
            </th>
          </tr>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length ? (
            filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td
                  className={
                    transaction.type === "Expense" ? "Expense" : "Income"
                  }
                >
                  {transaction.type === "Expense" ? "-" : ""}$
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
            ))
          ) : (
            <tr>
              <td colSpan="5" className="centered-content">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;
