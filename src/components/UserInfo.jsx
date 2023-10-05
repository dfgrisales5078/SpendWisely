import React from "react";

function UserInfo({ name, totalBalance, totalIncome, totalExpenses }) {
  const formatCurrency = (amount) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="mb-4 py-9">
      <h1 className="text-4xl text-center pb-3">Hello, {name}!</h1>
      <div className="text-center">
        <h2
          className={
            totalBalance > 0
              ? "text-green-700 text-3xl"
              : totalBalance < 0
              ? "text-red-500 text-3xl"
              : "text-black text-3xl"
          }
        >
          Total Balance: ${formatCurrency(totalBalance)}
        </h2>
        <h4 className="text-2xl">
          Total Income: ${formatCurrency(totalIncome)}
        </h4>
        <h4 className="text-2xl">
          Total Expenses: -${formatCurrency(totalExpenses)}
        </h4>
      </div>
    </div>
  );
}

export default UserInfo;
