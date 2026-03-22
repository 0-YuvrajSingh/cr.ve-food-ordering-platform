import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "",
    zip: "", country: "", phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.street.trim()) newErrors.street = "Street is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Valid 10-digit phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    const subtotal = getTotalCartAmount();
    const delivery = subtotal === 0 ? 0 : deliveryFee;
    const total = subtotal + delivery;
    localStorage.setItem("orderSummary", JSON.stringify({ subtotal, delivery, total }));
    navigate("/checkout");
  };

  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : deliveryFee;
  const total = subtotal + delivery;

  const Field = ({ name, label, type = "text" }) => (
    <div className="field-wrapper">
      <input
        type={type}
        placeholder={label}
        value={form[name]}
        onChange={handleChange(name)}
      />
      {errors[name] && <span className="error">⚠ {errors[name]}</span>}
    </div>
  );

  return (
    <form className="place-order" onSubmit={(e) => e.preventDefault()}>
      {/* ── Left: Delivery form ── */}
      <div className="place-order-left">
        <h2 className="title">Delivery Information</h2>

        <div className="multi-fields">
          <Field name="firstName" label="First Name" />
          <Field name="lastName" label="Last Name" />
        </div>

        <Field name="email" label="Email Address" type="email" />
        <Field name="street" label="Street Address" />

        <div className="multi-fields">
          <Field name="city" label="City" />
          <Field name="state" label="State" />
        </div>

        <div className="multi-fields">
          <Field name="zip" label="ZIP Code" type="number" />
          <Field name="country" label="Country" />
        </div>

        <Field name="phone" label="Phone Number" type="number" />
      </div>

      {/* ── Right: Order summary ── */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2 className="title">Order Summary</h2>

          <div className="cart-total-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-total-row">
            <span>Delivery Fee</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className="cart-total-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="place-order-buttons">
            <button type="button" className="btn-back" onClick={() => navigate("/cart")}>
              ← Back to Cart
            </button>
            <button
              type="button"
              className="btn-pay"
              disabled={subtotal === 0}
              onClick={handlePayment}
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
