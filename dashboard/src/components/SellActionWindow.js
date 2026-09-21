import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import axios from "axios";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const context = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState("1");
  const [stockPrice, setStockPrice] = useState(0.0);
  const [product, setProduct] = useState("CNC"); // CNC = delivery holding, MIS = intraday position

  useEffect(() => {
    const stock = watchlist.find((s) => s.name === uid);
    if (stock) setStockPrice(stock.price);
  }, [uid]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") context.closeSellWindow();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [context]);

  const handleCancelClick = () => {
    context.closeSellWindow();
  };

  const handleSellClick = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/newOrder`,
        {
          name: uid,
          qty: Number(stockQuantity),
          price: stockPrice,
          mode: "SELL",
          product,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("dashboardToken"),
          },
        }
      );

      context.closeSellWindow();
      window.location.reload();
    } catch (err) {
      console.error("Error placing sell order:", err);
      alert(err.response?.data?.msg || "Sell failed");
    }
  };

  const qtyValid = Number(stockQuantity) > 0;

  return (
    <div className="order-window-overlay" onClick={handleCancelClick}>
      <div
        className="container"
        id="sell-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="window-header">
          <h4>Sell {uid}</h4>
          <button
            type="button"
            className="close-icon"
            aria-label="Close"
            onClick={handleCancelClick}
          >
            &times;
          </button>
        </div>

        <div className="regular-order">
          <div className="product-toggle">
            <button
              type="button"
              className={product === "CNC" ? "product-btn active" : "product-btn"}
              onClick={() => setProduct("CNC")}
            >
              Delivery
            </button>
            <button
              type="button"
              className={product === "MIS" ? "product-btn active" : "product-btn"}
              onClick={() => setProduct("MIS")}
            >
              Intraday
            </button>
          </div>
          <p className="product-hint">
            {product === "CNC"
              ? "Exits a delivery holding."
              : "Exits an open intraday position."}
          </p>

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                autoFocus
              />
            </fieldset>

            <fieldset>
              <legend>Price</legend>
              <input type="number" value={stockPrice} readOnly />
            </fieldset>
          </div>
        </div>

        <div className="buttons">
          <span>
            Expected value ₹
            {(Number(stockQuantity || 0) * stockPrice).toFixed(2)}
          </span>

          <div>
            <button
              className="btn btn-red"
              onClick={handleSellClick}
              disabled={!qtyValid}
            >
              Sell
            </button>
            <button className="btn btn-grey" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;