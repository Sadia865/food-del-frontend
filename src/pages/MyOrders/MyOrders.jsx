import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
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
          headers: { token: token }
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
  }, [token, url]);

  if (loading) {
    return (
      <div className="myorders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myorders-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="myorders-container">
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myorders-container">
      <h2>My Orders</h2>
      <div className="orders-grid">
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
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Total Amount:</span>
                <span className="value">${order.amount?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Items:</span>
                <span className="value">{order.items?.length}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status status-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  ⚫ {order.status}
                </span>
              </div>
            </div>

            <button onClick={fetchOrders} className="track-btn">
              Refresh Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;