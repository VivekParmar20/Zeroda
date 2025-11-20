import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css";
import axios from "axios";

const BuyActionWindow = ({ uid }) => {
  const context = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState("1"); // string for typing
  const [stockPrice, setStockPrice] = useState(0.0);

  // Set stock price from watchlist when component mounts
  useEffect(() => {
    const stock = watchlist.find((s) => s.name === uid);
    if (stock) {
      setStockPrice(stock.price);
    }
  }, [uid]);

  const handleBuyClick = async () => {
    try {
      await axios.post(
  `${process.env.REACT_APP_BACKEND_URL}/newOrder`,

        {
          name: uid,
          qty: Number(stockQuantity),
          price: stockPrice,
          mode: "BUY",
        },
        { headers: {
    Authorization: "Bearer " + localStorage.getItem("dashboardToken")
  } } // important for auth cookie
      );

      window.location.reload(); // refresh to reflect new holdings/orders
      context.closeBuyWindow();
    } catch (err) {
      console.error("Error placing order:", err.response || err);
      alert("Failed to place order. Please check login/auth status.");
    }
  };

  const handleCancelClick = () => {
    context.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
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
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button className="btn btn-green" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
