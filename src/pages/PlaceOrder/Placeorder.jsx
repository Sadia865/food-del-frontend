import React, { useContext, useEffect, useState } from "react";
import "./Placeorder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Placeorder = () => {
  const { cartItems, getCartTotalPrice, food_list, token, url } =
    useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);

      // ✅ build items correctly
      const itemsArray = Object.entries(cartItems)
        .map(([id, qty]) => {
          const product = food_list.find(p => p._id === id);
          if (!product) return null;

          return {
            name: product.name,
            quantity: qty,
            price: product.price
          };
        })
        .filter(Boolean);

      const orderData = {
        items: itemsArray,
        amount: getCartTotalPrice(),
        address: formData
      };

      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        // ✅ STRIPE REDIRECT
        window.location.href = response.data.session_url;
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };
  const navigate=useNavigate();
useEffect(()=>{
  if(!token){
    navigate('/cart')
  }
  else if(getCartTotalPrice()===0){
    navigate('/cart')
  }

},[token])
  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        </div>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="street" placeholder="Street" onChange={handleChange} />

        <div className="multi-fields">
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="state" placeholder="State" onChange={handleChange} />
        </div>

        <div className="multi-fields">
          <input name="zip" placeholder="Zip" onChange={handleChange} />
          <input name="country" placeholder="Country" onChange={handleChange} />
        </div>
      </div>

      <div className="place-order-right">
        <p className="title">Order Summary</p>

        {Object.entries(cartItems).map(([id, qty]) => {
          const product = food_list.find(p => p._id === id);
          if (!product) return null;

          return (
            <div key={id} className="summary-item">
              <span>{product.name}</span>
              <span>Qty: {qty}</span>
            </div>
          );
        })}

        <hr />
        <p>Total: ${getCartTotalPrice()}</p>

        <button disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </form>
  );
};

export default Placeorder;
