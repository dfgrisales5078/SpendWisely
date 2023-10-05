import React from "react";

function TransactionForm({
  transactionType,
  setTransactionType,
  selectedCategory,
  handleCategoryChange,
  amount,
  handleAmountChange,
  handleAddTransaction,
  categories,
}) {
  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleAddTransaction}
        className="form-group justify-center w-full max-w-xl"
      >
        <label>Transaction type:</label>
        <select
          value={transactionType}
          onChange={(e) => {
            setTransactionType(e.target.value);
          }}
          className="form-control w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <label className="block mt-4 mb-2">Transaction category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="form-control w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="block mt-4 mb-2">Transaction amount:</label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="form-control w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />

        <div className="d-flex justify-center mt-4 pb-10">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              !selectedCategory || !amount
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!selectedCategory || !amount}
          >
            Add transaction
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
