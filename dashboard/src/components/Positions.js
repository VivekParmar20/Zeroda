import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const token = localStorage.getItem("dashboardToken");

  const fetchPositions = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/allPositions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllPositions(res.data))
      .catch((err) => {
        console.error("Failed to fetch positions:", err);

        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("dashboardToken");
          window.location.href = process.env.REACT_APP_FRONTEND_URL;
        }
      });
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Intraday positions are meant to move with the market — keep them live,
  // same as Holdings does.
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getUpdatePrices`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(fetchPositions)
        .catch((err) => console.error("Error updating position prices:", err));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (allPositions.length === 0) {
    return (
      <>
        <h3 className="title">Positions (0)</h3>
        <p style={{ color: "#888", marginTop: "1rem" }}>
          No open intraday positions. Place a Buy or Sell with the{" "}
          <strong>Intraday</strong> product type selected to open one — it
          will show up here instead of in Holdings, and should be squared off
          the same day.
        </p>
      </>
    );
  }

  // Derived totals — same shape as Holdings, so P&L reads consistently
  // across both pages.
  const totalInvestment = allPositions.reduce(
    (sum, s) => sum + s.avg * s.qty,
    0
  );
  const currentValue = allPositions.reduce(
    (sum, s) => sum + s.price * s.qty,
    0
  );
  const profitLoss = currentValue - totalInvestment;
  const profitPercent = totalInvestment
    ? (profitLoss / totalInvestment) * 100
    : 0;

  const chartData = {
    labels: allPositions.map((s) => s.name),
    datasets: [
      {
        label: "Current Value (₹)",
        data: allPositions.map((s) => s.price * s.qty),
        backgroundColor: allPositions.map((s) =>
          s.price * s.qty - s.avg * s.qty >= 0
            ? "rgba(0,200,83,0.6)"
            : "rgba(255,82,82,0.6)"
        ),
      },
    ],
  };

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product || "MIS"}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row mt-4 text-center">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total Investment</p>
        </div>

        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current Value</p>
        </div>

        <div className="col">
          <h5
            style={{
              color: profitLoss >= 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {profitLoss >= 0 ? "▲" : "▼"} ₹{Math.abs(profitLoss).toFixed(2)} (
            {profitPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={chartData} title="Positions" />
    </>
  );
};

export default Positions;