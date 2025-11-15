import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  // Load holdings initially
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/allHoldings`, { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setAllHoldings(Array.isArray(data) ? data : data.updated || []);
      })
      .catch((err) => {
        console.error("Failed to fetch holdings:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
      });
  }, []);

  // Auto-refresh prices every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getUpdatePrices`, {
          withCredentials: true,
        });
        const data = res.data;
        console.log( data);
        
        setAllHoldings(Array.isArray(data) ? data : data.updated || []);
      } catch (err) {
        console.error("Error updating prices:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Derived totals
  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + s.avg * s.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, s) => sum + s.price * s.qty,
    0
  );
  const profitLoss = currentValue - totalInvestment;
  const profitPercent = totalInvestment
    ? (profitLoss / totalInvestment) * 100
    : 0;

  const labels = allHoldings.map((s) => s.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Current Value (₹)",
        data: allHoldings.map((s) => s.price * s.qty),
        backgroundColor: allHoldings.map((s) =>
          s.price * s.qty - s.avg * s.qty >= 0
            ? "rgba(0,200,83,0.6)"
            : "rgba(255,82,82,0.6)"
        ),
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg Cost</th>
              <th>LTP</th>
              <th>Cur Val</th>
              <th>P&L</th>
              <th>Net Chg</th>
             
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((s) => {
              const curVal = s.price * s.qty;
              const pnl = curVal - s.avg * s.qty;
              const isProfit = pnl >= 0;
              return (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.qty}</td>
                  <td>{s.avg.toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    ₹{s.price.toFixed(2)}
                  </td>
                  <td>₹{curVal.toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {isProfit ? "▲" : "▼"} ₹{Math.abs(pnl).toFixed(2)}
                  </td>
                  <td className={isProfit ? "profit" : "loss"}>{s.net}</td>
                  {/* <td className={isProfit ? "profit" : "loss"}>{s.day}</td> */}
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

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
