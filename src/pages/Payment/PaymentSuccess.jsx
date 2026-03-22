import React from "react";
import "./PaymentSuccess.css";
import { useNavigate, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>
          Your order has been confirmed and is being prepared. 
          Expect delivery within 30–45 minutes. Bon appétit! 🍽️
        </p>
        <button className="home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <Link to="/menu" style={{ fontSize: "0.85rem", color: "var(--on-surface-muted)" }}>
          Order more food →
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
