import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css";
import axios from "axios";

const BuyActionWindow = ({ uid }) => {
  const context = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState("1"); // string for typing
  const [stockPrice, setStockPrice] = useState(0.0);
  const [product, setProduct] = useState("CNC"); // CNC = delivery, MIS = intraday

  // Set stock price from watchlist when component mounts
  useEffect(() => {
    const stock = watchlist.find((s) => s.name === uid);
    if (stock) {
      setStockPrice(stock.price);
    }
  }, [uid]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") context.closeBuyWindow();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [context]);

  const handleBuyClick = async () => {
    try {
      await axios.post(
  `${process.env.REACT_APP_BACKEND_URL}/newOrder`,

        {
          name: uid,
          qty: Number(stockQuantity),
          price: stockPrice,
          mode: "BUY",
          product,
        },
        { headers: {
    Authorization: "Bearer " + localStorage.getItem("dashboardToken")
  } } // important for auth cookie
      );

      context.closeBuyWindow();
      window.location.reload(); // refresh to reflect new holdings/orders
    } catch (err) {
      console.error("Error placing order:", err.response || err);
      alert(err.response?.data?.msg || "Failed to place order. Please check login/auth status.");
    }
  };

  const handleCancelClick = () => {
    context.closeBuyWindow();
  };

  const qtyValid = Number(stockQuantity) > 0;

  return (
    <div className="order-window-overlay" onClick={handleCancelClick}>
      <div
        className="container"
        id="buy-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="window-header">
          <h4>Buy {uid}</h4>
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
              ? "Delivery: goes to Holdings, carried over to future days."
              : "Intraday: goes to Positions, meant to be squared off the same day."}
          </p>

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                autoFocus
              />
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                id="price"
                value={stockPrice}
                readOnly
              />
            </fieldset>
          </div>
        </div>

        <div className="buttons">
          <span>
            Margin required ₹
            {(Number(stockQuantity || 0) * stockPrice).toFixed(2)}
          </span>
          <div>
            <button
              className="btn btn-green"
              onClick={handleBuyClick}
              disabled={!qtyValid}
            >
              Buy
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

export default BuyActionWindow;