import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/allOrders`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) {
    return <p>No orders placed yet.</p>;
  }

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Mode</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={i}>
              <td>{order.name}</td>
              <td>{order.qty}</td>
              <td>{order.price}</td>
              <td>{order.mode}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
