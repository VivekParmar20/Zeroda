import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const THRESHOLD = 3740.0; // Opening balance or max available margin
  const [funds, setFunds] = useState({
    openingBalance: THRESHOLD,
    totalInvestment: 0,
    currentValue: 0,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/allHoldings`, { withCredentials: true })
      .then((res) => {
        const holdings = res.data || [];

        // calculate totals for this user's holdings
        const totalInvestment = holdings.reduce(
          (sum, s) => sum + (s.avg || 0) * (s.qty || 0),
          0
        );
        const currentValue = holdings.reduce(
          (sum, s) => sum + (s.price || 0) * (s.qty || 0),
          0
        );

        setFunds({
          openingBalance: THRESHOLD,
          totalInvestment,
          currentValue,
        });
      })
      .catch((err) => console.error("Failed to load holdings:", err));
  }, []);

  const { openingBalance, totalInvestment, currentValue } = funds;

  // Derived values
  const pnl = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  // Threshold logic
  const exceedsThreshold = totalInvestment > openingBalance;
  const marginsUsed = totalInvestment;
  const marginAvailable = exceedsThreshold
    ? 0
    : openingBalance - totalInvestment;
  const availableCash = marginAvailable;

  return (
    <>
      <div className="funds-actions">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button className="btn btn-green">Add Funds</button>
        <button className="btn btn-blue">Withdraw</button>
      </div>

      <div className="funds-summary">
        <h4>Equity</h4>
        <h3>₹{openingBalance.toFixed(2)}</h3>
        <p>Margin available</p>

        <div className="funds-breakdown">
          <p>
            Margins used <span>₹{marginsUsed.toFixed(2)}</span>
          </p>
          <p>
            Opening balance <span>₹{openingBalance.toFixed(2)}</span>
          </p>
        </div>

        <h5
          style={{
            color: pnl >= 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {pnl >= 0 ? "▲" : "▼"} ₹{Math.abs(pnl).toFixed(2)}{" "}
          <span style={{ color: "#000" }}>
            ({pnlPercent.toFixed(2)}%)
          </span>
        </h5>
        <p>P&amp;L</p>

        <div className="funds-breakdown">
          <p>
            Current Value <span>₹{currentValue.toFixed(2)}</span>
          </p>
          <p>
            Investment <span>₹{totalInvestment.toFixed(2)}</span>
          </p>
        </div>

        <hr className="divider" />

        <div className="funds-details">
          <p>
            Available Margin <span>₹{marginAvailable.toFixed(2)}</span>
          </p>
          <p>
            Used Margin <span>₹{marginsUsed.toFixed(2)}</span>
          </p>
          <p>
            Available Cash <span>₹{availableCash.toFixed(2)}</span>
          </p>
        </div>

        {exceedsThreshold && (
          <p style={{ color: "red", marginTop: "1rem" }}>
            ⚠️ You’ve exceeded your available funds (₹
            {openingBalance.toFixed(2)}). Add more to continue trading.
          </p>
        )}
      </div>
    </>
  );
};

export default Funds;
