import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
const  navigate=useNavigate();

  const { cartItems, food_list, removeFromCart,url } = useContext(StoreContext);

  // Calculate Subtotal
  const subtotal = food_list.reduce((total, item) => {
    return total + (cartItems[item._id] ? item.price * cartItems[item._id] : 0);
  }, 0);

  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className='cart'>
      <div className="cart-items">

        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {/* Cart Items */}
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-item'>
                  
                  <img src={url+"/images//"+item.image} alt="" className="cart-item-img" />

                  <p>{item.name}</p>

                  <p>${item.price}</p>

                  <p>{cartItems[item._id]}</p>

                  <p>${item.price * cartItems[item._id]}</p>

                  <p 
                    className='remove-btn'
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>

                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}

      </div>

      {/* Bottom Section */}
      <div className="cart-bottom">

        {/* LEFT SIDE - Totals */}
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${deliveryFee.toFixed(2)}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${total.toFixed(2)}</b>
          </div>

          <button onClick={()=>{navigate('/order')}} className="checkout-btn">PROCEED TO CHECKOUT</button>
        </div>

        {/* RIGHT SIDE - Promo Code */}
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>

          <div className="cart-promocode-input">
            <input type="text" placeholder='Promo Code' />
            <button>Submit</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
