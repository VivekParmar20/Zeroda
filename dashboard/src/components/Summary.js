import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

const Summary = () => {
  const THRESHOLD = 3740.0; // Opening balance / available margin

  const [funds, setFunds] = useState({
    openingBalance: THRESHOLD,
    totalInvestment: 0,
    currentValue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("dashboardToken");

    // Combine delivery Holdings with open intraday Positions, so the
    // dashboard summary reflects the same total exposure the backend's
    // margin check uses (see /newOrder).
    const fetchSummary = () => {
      Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/allHoldings`, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/allPositions`, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
        .then(([holdingsRes, positionsRes]) => {
          const combined = [
            ...(holdingsRes.data || []),
            ...(positionsRes.data || []),
          ];

          const totalInvestment = combined.reduce(
            (sum, s) => sum + (s.avg || 0) * (s.qty || 0),
            0
          );

          const currentValue = combined.reduce(
            (sum, s) => sum + (s.price || 0) * (s.qty || 0),
            0
          );

          setFunds({
            openingBalance: THRESHOLD,
            totalInvestment,
            currentValue,
          });
        })
        .catch((err) => console.error("Failed to fetch holdings/positions:", err));
    };

    fetchSummary();

    // Drive our own price tick (same as Holdings/Positions do) so the
    // dashboard's P&L is live even if neither of those pages is open.
    const interval = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getUpdatePrices`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(fetchSummary)
        .catch((err) => console.error("Error updating prices:", err));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const { openingBalance, totalInvestment, currentValue } = funds;

  // ---- Derived values ----
  const pnl = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  const exceedsThreshold = totalInvestment > openingBalance;
  const marginAvailable = exceedsThreshold
    ? 0
    : openingBalance - totalInvestment;

  const marginsUsed = totalInvestment;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      {/* Equity / Funds Summary */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{marginAvailable.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{marginsUsed.toFixed(2)}</span>
            </p>
            <p>
              Opening balance <span>₹{openingBalance.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      {/* Profit / Loss Section */}
      <div className="section">
        <div className="data">
          <div className="first">
            <h3
              style={{
                color: pnl >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {pnl >= 0 ? "▲" : "▼"} ₹{Math.abs(pnl).toFixed(2)}{" "}
              <small style={{ color: "#000" }}>
                ({pnlPercent.toFixed(2)}%)
              </small>
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{currentValue.toFixed(2)}</span>
            </p>
            <p>
              Investment <span>₹{totalInvestment.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {exceedsThreshold && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            ⚠️ You’ve exceeded your available funds. Please add more to
            continue trading.
          </p>
        )}

        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
