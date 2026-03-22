import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-content">
          {/* Left */}
          <div className="footer-content-left">
            <img src={assets.logo} alt="CR·VE Logo" />
            <p>
              At <strong style={{ color: "#fff" }}>CR<span className="dot">·</span>VE</strong>,
              we're redefining how people experience food. Blending bold flavors with fresh
              ingredients, we deliver delight at your doorstep — every time.
            </p>
          </div>

          {/* Center */}
          <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
              <li onClick={() => navigate("/")}>Home</li>
              <li>About Us</li>
              <li onClick={() => navigate("/menu")}>Menu</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Right */}
          <div className="footer-content-right">
            <h2>Contact Us</h2>
            <ul>
              <li>+1-123-456-7890</li>
              <li>contact@crve.com</li>
            </ul>
            <div className="footer-social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <img src={assets.facebook_icon} alt="Facebook" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <img src={assets.twitter_icon} alt="Twitter" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <img src={assets.linkedin_icon} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="footer-copyright">
          Copyright 2025 © <span className="brand">CR<span className="dot">·</span>VE</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
