import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useNavigate } from "react-router-dom";

Chart.register(...registerables);

function FinancialOverviewPage() {
  const [barGraphData, setbarGraphData] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        // redirect to login page if user is not logged in
        if (!userId) {
          navigate("/");
          return;
        }

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

        setbarGraphData({
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
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg bg-white w-full max-w-2xl">
        <h2 className="text-4xl text-center p-3">
          Current Balance: $
          {totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>

        {barGraphData.labels ? (
          <div className="mt-6">
            <Bar
              data={barGraphData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: {
                        size: 20,
                      },
                    },
                  },
                  x: {
                    ticks: {
                      font: {
                        size: 20,
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
              height={400}
              width={800}
            />
          </div>
        ) : (
          <p className="text-center mt-6">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default FinancialOverviewPage;
