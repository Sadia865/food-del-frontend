import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
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
        return;
      }

      setOrderId(orderIdParam);

      try {
        // Call backend to update payment
        const { data } = await axios.post("http://localhost:4000/api/order/verify", {
          orderId: orderIdParam,
          success: successParam
        });

        if (data.success) {
          setStatus("Payment Successful! ✅ Redirecting to My Orders...");
          // Redirect to /myorder after 3 seconds
          setTimeout(() => {
            navigate("/myorder");
          }, 3000);
        } else {
          setStatus("Payment Failed or Canceled ❌");
        }

      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("Something went wrong during verification.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      {loading ? <p>Verifying payment...</p> : <h2>{status}</h2>}
      {!loading && orderId && <p>Order ID: {orderId}</p>}
    </div>
  );
};

export default Verify;
