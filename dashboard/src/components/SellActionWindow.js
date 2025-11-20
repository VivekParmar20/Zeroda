import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css"; // can reuse same CSS
import axios from "axios";

const SellActionWindow = ({ uid }) => {
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

  const handleSellClick = async () => {
    try {
      await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/newOrder`,
        {
          name: uid,
          qty: Number(stockQuantity),
          price: stockPrice,
          mode: "SELL",
        },
        { axios.post(`${process.env.REACT_APP_BACKEND_URL}/newOrder`, formData, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("dashboardToken")
  }
})
} // important for auth cookie
      );

      window.location.reload(); // refresh to reflect updated holdings/orders
      context.closeBuyWindow(); // same close function can be reused
    } catch (err) {
      console.error("Error placing sell order:", err.response || err);
      alert(
        err.response?.data || "Failed to place sell order. Check holdings or login."
      );
    }
  };

  const handleCancelClick = () => {
    context.closeBuyWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
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
        <span>Expected value ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
