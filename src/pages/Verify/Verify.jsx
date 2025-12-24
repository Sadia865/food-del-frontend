import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Verify.css";

const Verify = () => {
  const { url } = useContext(StoreContext); // ❌ remove token usage
  const [status, setStatus] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const orderIdParam = searchParams.get("orderId");
      const successParam = searchParams.get("success");

      if (!orderIdParam || !successParam) {
        setStatus("Invalid verification link.");
        setLoading(false);
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      setOrderId(orderIdParam);

      try {
        const { data } = await axios.post(
          `${url}/api/order/verify`,
          {
            orderId: orderIdParam,
            success: successParam
          }
        );

        if (data.success) {
          setStatus("Payment Successful! ✅ Redirecting to My Orders...");
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
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, url]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {loading && <div className="spinner"></div>}
        <h2 className={loading ? "loading-text" : ""}>{status}</h2>
        {!loading && orderId && (
          <p className="order-id">Order ID: {orderId}</p>
        )}
      </div>
    </div>
  );
};

export default Verify;
