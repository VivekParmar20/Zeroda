import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/allOrders`, {
        headers: {
    Authorization: "Bearer " + localStorage.getItem("dashboardToken")
  } // ✅ include cookies for authentication
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const totalOrders = orders.length;
  // const totalBuy = orders.filter((o) => o.mode === "Buy").length;
  // const totalSell = orders.filter((o) => o.mode === "Sell").length;

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
        <p className="mb-4 text-lg">You haven't placed any orders today</p>
        <Link
          to={"/"}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get started
        </Link>
      </div>
    );

  return (
    <>
      <h3 className="title">Orders ({totalOrders})</h3>

      {/* Summary Cards */}
      <div className="row mb-6 flex gap-6">
        <div className="col bg-gray-100 p-4 rounded-lg text-center flex-1">
          <h5 className="text-xl font-bold">{totalOrders}</h5>
          <p>Total Orders</p>
        </div>
        {/* <div className="col bg-green-100 p-4 rounded-lg text-center flex-1">
          <h5 className="text-xl font-bold">{totalBuy}</h5>
          <p>Buy Orders</p>
        </div> */}
        {/* <div className="col bg-red-100 p-4 rounded-lg text-center flex-1">
          <h5 className="text-xl font-bold">{totalSell}</h5>
          <p>Sell Orders</p>
        </div> */}
      </div>

      {/* Orders Table */}
      <div className="order-table overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Mode</th>
            
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2">{order.name}</td>
                <td className="px-4 py-2">{order.qty}</td>
                <td className="px-4 py-2">{order.price.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      order.mode === "Buy"
                        ? "bg-green-500"
                        : order.mode === "Sell"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {order.mode}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
