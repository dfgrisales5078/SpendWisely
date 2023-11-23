import React from "react";

const TransactionsTable = ({
  transactions,
  handleDeleteTransaction,
  filterType,
  handleFilterChange,
  filterTypes,
}) => {
  const filteredTransactions = transactions.filter((transaction) =>
    filterType === "All"
      ? true
      : transaction.transaction_type === filterType.toLowerCase()
  );

  filteredTransactions.sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
  );

  return (
    <div>
      <h4 className="text-2xl text-center pb-3">
        Transaction history for {new Date().getFullYear()}:
      </h4>
      <table className="table-auto w-full text-center">
        <thead>
          <tr>
            <th colSpan="5" className="text-center pb-4">
              {filterTypes.map((filter) => (
                <button
                  key={filter.label}
                  className={`btn py-1 px-3 ${
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length ? (
            filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td className="py-2">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td
                  className={`py-2 ${
                    transaction.transaction_type === "expense"
                      ? "text-red-500"
                      : "text-green-700"
                  }`}
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
  );
};

export default TransactionsTable;
