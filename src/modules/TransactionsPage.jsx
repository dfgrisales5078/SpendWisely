import React, { useState, useEffect, useCallback } from "react";

function TransactionsPage() {
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterType, setFilterType] = useState("All");

  function capitalizeName(lowerCaseName) {
    if (!lowerCaseName || typeof lowerCaseName !== "string") {
      return "";
    }
    return lowerCaseName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
    // format amount input to have commas and allow only two decimal places
    let formattedAmount = event.target.value.replace(/[^\d.]/g, "");
    const splitValue = formattedAmount.split(".");

    if (splitValue.length > 2) {
      formattedAmount = splitValue.shift() + "." + splitValue.join("");
    }

    if (splitValue[1]) {
      splitValue[1] = splitValue[1].substring(0, 2);
      formattedAmount = splitValue.join(".");
    }

    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setAmount(formattedAmount);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://54.162.34.12:4000/transactions/?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      const transactions = await response.json();
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]); // Add necessary dependencies here

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (event) => {
    event.preventDefault();

    if (selectedCategory && amount) {
      const newTransaction = {
        userId: userId,
        category: selectedCategory,
        amount: parseFloat(amount.replace(/,/g, "")),
        transactionType: transactionType.toLowerCase(),
        transactionDate: new Date().toISOString().slice(0, 10),
      };

      try {
        const response = await fetch("http://54.162.34.12:4000/transactions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        });

        if (!response.ok) {
          throw new Error("Failed to add transaction.");
        }

        // Fetch the latest transactions
        fetchTransactions();

        // Reset form fields
        setSelectedCategory("");
        setAmount("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await fetch(`http://54.162.34.12:4000/transactions/${transactionId}`, {
        method: "DELETE",
      });
      const updatedTransactions = transactions.filter(
        (t) => t.transaction_id !== transactionId
      );
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredTransactions =
    filterType === "All"
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.transaction_type === filterType.toLowerCase()
        );

  // Sort the transactions by date in descending order
  filteredTransactions.sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
  );

  const totalIncome = transactions
    .filter((transaction) => transaction.transaction_type === "income")
    .reduce(
      (total, transaction) =>
        total + parseFloat(transaction.transaction_amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.transaction_type === "expense")
    .reduce(
      (total, transaction) =>
        total + parseFloat(transaction.transaction_amount),
      0
    );

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
        <h1 className="mb-4">Hello, {capitalizeName(name)}!</h1>
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
        <form onSubmit={handleAddTransaction}>
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
      <table className="table centered-content">
        <thead>
          <tr>
            <th colSpan="5" className="text-right">
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
                <td>
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td
                  className={
                    transaction.transaction_type === "expense"
                      ? "Expense"
                      : "Income"
                  }
                >
                  {transaction.transaction_type === "expense" ? "-" : ""}$
                  {parseFloat(transaction.transaction_amount).toLocaleString(
                    "en-US",
                    {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td>{transaction.category_name}</td>
                <td>
                  {transaction.transaction_type.charAt(0).toUpperCase() +
                    transaction.transaction_type.slice(1)}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleDeleteTransaction(transaction.transaction_id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="centered-content">
                <h4>No transactions found.</h4>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;
