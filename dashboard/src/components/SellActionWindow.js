import React, { useState, useContext, useEffect } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import axios from "axios";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const context = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState("1");
  const [stockPrice, setStockPrice] = useState(0.0);

  useEffect(() => {
    const stock = watchlist.find((s) => s.name === uid);
    if (stock) setStockPrice(stock.price);
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
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("dashboardToken"),
          },
        }
      );

      window.location.reload();
      context.closeBuyWindow();
    } catch (err) {
      console.error("Error placing sell order:", err);
      alert("Sell failed");
    }
  };

  return (
    <div className="container" id="sell-window">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input type="number" value={stockPrice} readOnly />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Expected value ₹{(stockQuantity * stockPrice).toFixed(2)}</span>

        <div>
          <button className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={context.closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
