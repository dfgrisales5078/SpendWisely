import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function GraphPage() {
  const [data, setData] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await fetch(
          `http://localhost:2020/transactions/?userId=${userId}`
        );
        const transactions = await response.json();

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

        const balance = parseFloat(totalIncome) - parseFloat(totalExpenses);
        setTotalBalance(balance);

        setData({
          labels: ["Income", "Expenses"],
          datasets: [
            {
              label: "Amount",
              data: [totalIncome, totalExpenses],
              backgroundColor: ["green", "red"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{ minHeight: "600px", minWidth: "1000px", margin: "50px auto" }}
    >
      <h2 style={{ textAlign: "center" }}>
        Total Balance: $
        {totalBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>

      <br />
      {data.labels ? (
        <Bar
          data={data}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 25,
                  },
                },
              },
              x: {
                ticks: {
                  font: {
                    size: 25,
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          height={600}
          width={1000}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GraphPage;
