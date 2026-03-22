import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FakePayment.css";

const FakePayment = () => {
  const { setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ subtotal: 0, delivery: 0, total: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orderSummary"));
    if (saved) setSummary(saved);
  }, []);

  const handlePayment = () => {
    setCartItems({});
    localStorage.removeItem("orderSummary");
    navigate("/success");
  };

  return (
    <div className="fake-payment">
      <div className="fake-payment-container">
        <h2>💳 Secure Payment</h2>

        <div className="summary">
          <p><span>Subtotal</span><span>${summary.subtotal.toFixed(2)}</span></p>
          <p><span>Delivery Fee</span><span>${summary.delivery.toFixed(2)}</span></p>
          <h3><span>Total Due</span><span>${summary.total.toFixed(2)}</span></h3>
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          Confirm & Pay ${summary.total.toFixed(2)} →
        </button>

        <p className="payment-notice">
          🔒 This is a demo — no real payment is processed.
        </p>
      </div>
    </div>
  );
};

export default FakePayment;
