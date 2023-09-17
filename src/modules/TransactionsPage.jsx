import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function TransactionsPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Redirect to home page if user is not logged in
  useEffect(() => {
    if (!userId || !name) {
      navigate("/");
    }
  }, [userId, name, navigate]);

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

  function capitalizeName(lowerCaseName) {
    if (!lowerCaseName || typeof lowerCaseName !== "string") {
      return "";
    }
    return lowerCaseName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
        `http://localhost:2020/transactions/?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      const transactions = await response.json();
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

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
        const response = await fetch("http://localhost:2020/transactions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        });

        if (!response.ok) {
          throw new Error("Failed to add transaction.");
        }

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
      await fetch(`http://localhost:2020/transactions/${transactionId}`, {
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg w-full max-w-2xl">
        <div className="mb-4">
          <h1 className="text-4xl text-left pb-3">
            Hello, {capitalizeName(name)}!
          </h1>
          <div className="text-left">
            <h2
              className={
                totalBalance > 0
                  ? "text-green-700 text-3xl"
                  : totalBalance < 0
                  ? "text-red-500 text-3xl"
                  : "text-black text-3xl"
              }
            >
              Total Balance: $
              {totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h2>
            <h4 className="text-2xl">
              Total Income: $
              {totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h4>
            <h4 className="text-2xl">
              Total Expenses: -$
              {totalExpenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h4>
          </div>
        </div>

        <form onSubmit={handleAddTransaction} className="form-group mb-4">
          <label>Type:</label>
          <select
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value);
              setSelectedCategory("");
            }}
            className="form-control w-full border rounded-lg outline-none 
            focus:ring-2 focus:ring-blue-500"
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <label className="block mt-4 mb-2">Category:</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-control w-full border rounded-lg outline-none 
            focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label className="block mt-4 mb-2">Amount:</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="form-control w-full border rounded-lg outline-none 
            focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />

          <div className="d-flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 justify-normal 
              rounded-lg shadow-md transition duration-300 ease-in-out 
              hover:bg-blue-600 hover:shadow-lg active:bg-blue-700"
              disabled={!selectedCategory || !amount}
            >
              Add Transaction
            </button>
          </div>
        </form>

        <div>
          <h4 className="text-2xl text-left pb-4">
            Transaction history {getCurrentMonthYear()}:
          </h4>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th colSpan="5" className="text-right pb-4">
                  {filterTypes.map((filter) => (
                    <button
                      key={filter.label}
                      className={`btn py-1 px-3 ${
                        filterType === filter.label
                          ? filter.className
                          : "btn-light"
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length ? (
                filteredTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="py-2">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-2 ${
                        transaction.transaction_type === "expense"
                          ? "text-red-500"
                          : "text-green-700"
                      }`}
                    >
                      {transaction.transaction_type === "expense" ? "-" : ""}$
                      {parseFloat(
                        transaction.transaction_amount
                      ).toLocaleString("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2">{transaction.category_name}</td>
                    <td className="py-2">
                      {transaction.transaction_type.charAt(0).toUpperCase() +
                        transaction.transaction_type.slice(1)}
                    </td>
                    <td className="py-2">
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
                  <td colSpan="5" className="text-center py-4">
                    <h4>No transactions found.</h4>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
