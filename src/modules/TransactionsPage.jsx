import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import TransactionForm from "../components/TransactionForm";
import TransactionsTable from "../components/TransactionsTable";

function TransactionsPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
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

  const handleAmountChange = (event) => {
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
        userId,
        category: selectedCategory,
        amount: parseFloat(amount.replace(/,/g, "")),
        transactionType: transactionType.toLowerCase(),
        transactionDate: new Date().toISOString().slice(0, 10),
      };

      try {
        const response = await fetch("http://localhost:2020/transactions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTransaction),
        });

        if (!response.ok) {
          throw new Error("Failed to add transaction.");
        }

        fetchTransactions();
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
      setTransactions((prev) =>
        prev.filter((t) => t.transaction_id !== transactionId)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const totalIncome = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce(
      (total, transaction) =>
        total + parseFloat(transaction.transaction_amount),
      0
    );

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce(
      (total, transaction) =>
        total + parseFloat(transaction.transaction_amount),
      0
    );

  const totalBalance = totalIncome - totalExpenses;

  const categories =
    transactionType === "Expense" ? expenseCategories : incomeCategories;

  const filterTypes = [
    { label: "All", className: "btn-primary" },
    { label: "Income", className: "btn-success" },
    { label: "Expense", className: "btn-danger" },
  ];

  function AuthCheck({ userId, name }) {
    useEffect(() => {
      if (!userId || !name) {
        navigate("/");
      }
    }, [userId, name]);

    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg w-full max-w-4xl">
        <AuthCheck userId={userId} name={name} navigate={navigate} />
        <UserInfo
          name={name}
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
        <TransactionForm
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
          amount={amount}
          handleAmountChange={handleAmountChange}
          handleAddTransaction={handleAddTransaction}
        />
        <TransactionsTable
          transactions={transactions}
          handleDeleteTransaction={handleDeleteTransaction}
          filterType={filterType}
          handleFilterChange={handleFilterChange}
          filterTypes={filterTypes}
        />
      </div>
    </div>
  );
}

export default TransactionsPage;
