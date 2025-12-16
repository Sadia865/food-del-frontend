import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        
        {/* LEFT SIDE */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic officiis 
            dignissimos debitis dicta dolorum asperiores rerum corporis quae repellat 
            deserunt. Quia, qui laboriosam dolorum ea atque tempora quam sed reiciendis.
          </p>

          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+12-3928-499</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>

      <hr />

      {/* AUTO YEAR COPYRIGHT TEXT */}
      <p className="footer-copyright">
        © {new Date().getFullYear()} Tomato — All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
