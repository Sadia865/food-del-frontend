import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const totalAmount = getTotalCartAmount();

  const logoutHandler = () => {
    localStorage.removeItem("token"); // remove token from storage
    setToken(""); // clear token in context
    navigate("/"); // optional: redirect to home page
  };

  return (
    <nav className='navbar'>
      <Link to='/'>
        <img src={assets.logo} alt='Logo' className='logo' />
      </Link>

      <ul className="navbar-menu">
        <li>
          <Link
            to='/'
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href='#explore-menu'
            onClick={() => setMenu("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </a>
        </li>
        <li>
          <a
            href='#app-download'
            onClick={() => setMenu("mobile-app")}
            className={menu === "mobile-app" ? "active" : ""}
          >
            Mobile App
          </a>
        </li>
        <li>
          <a
            href='#footer'
            onClick={() => setMenu("contact-us")}
            className={menu === "contact-us" ? "active" : ""}
          >
            Contact Us
          </a>
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt='Search' className='search-icon' />

        <div className="navbar-cart-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt='Basket' />
            {totalAmount > 0 && <span className="dot"></span>}
          </Link>
        </div>

        {!token ? (
          <button className='sign-in-btn' onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logoutHandler}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
