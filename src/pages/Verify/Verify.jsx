import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Verify.css";

const Verify = () => {
  const { url, token } = useContext(StoreContext);
  const [status, setStatus] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const orderIdParam = searchParams.get("orderId");
      const successParam = searchParams.get("success");

      // Check if user is logged in
      if (!token) {
        setStatus("Please login to view your order");
        setLoading(false);
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      if (!orderIdParam || !successParam) {
        setStatus("Invalid verification link.");
        setLoading(false);
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      setOrderId(orderIdParam);

      try {
        // Call backend to update payment status
        const { data } = await axios.post(
          `${url}/api/order/verify`,
          {
            orderId: orderIdParam,
            success: successParam
          },
          {
            headers: { token }
          }
        );

        if (data.success) {
          setStatus("Payment Successful! ✅ Redirecting to My Orders...");
          // Redirect to /myorders after 2 seconds
          setTimeout(() => {
            navigate("/myorders");
          }, 2000);
        } else {
          setStatus("Payment Failed or Canceled ❌");
          setTimeout(() => {
            navigate("/cart");
          }, 3000);
        }

      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("Something went wrong during verification.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, url, token]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {loading && (
          <div className="spinner"></div>
        )}
        <h2 className={loading ? "loading-text" : ""}>{status}</h2>
        {!loading && orderId && (
          <p className="order-id">Order ID: {orderId}</p>
        )}
      </div>
    </div>
  );
};

export default Verify;