import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext); // Use token instead of user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        console.log("No token found");
        setLoading(false);
        setError("Please login to view your orders");
        return;
      }

      // Pass token in headers
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {}, // Empty body - userId comes from token
        {
          headers: { token: token } // Backend decodes token to get userId
        }
      );

      console.log("Orders response:", response.data);

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please login to view orders");
    }
  }, [token]);

  if (loading) return <p className="loading">Loading your orders...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (orders.length === 0) return <p className="no-orders">You have no orders yet.</p>;

  return (
    <div className="myorders-container">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <img src={assets.parcel_icon} alt="parcel" />
            <div className="order-items">
              {order.items?.map((item, idx) => (
                <span key={idx}>
                  {item.name} x {item.quantity}
                  {idx < order.items.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
            <p className="order-amount">${order.amount}</p>
            <button onClick={fetchOrders} className="track-btn">
              Track Order
            </button>
          </div>
          <div className="order-status">
            <p>Items: {order.items?.length}</p>
            <p>⚫ <b>{order.status}</b></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;