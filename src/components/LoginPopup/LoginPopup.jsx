import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "Please wait…", type: "loading" });

    try {
      if (currentState === "Sign Up") {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage({ text: "Account created successfully! Welcome to CR·VE 🎉", type: "success" });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage({ text: "Signed in successfully! 🎉", type: "success" });
      }
      setTimeout(() => setShowLogin(false), 1800);
    } catch (error) {
      const msg = error.message
        .replace("Firebase:", "")
        .replace(/\(auth\/[^)]+\)/, "")
        .trim();
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const toggleState = () => {
    setCurrentState((s) => (s === "Sign Up" ? "Login" : "Sign Up"));
    setMessage({ text: "", type: "" });
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-popup" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
      <form className="login-popup-container" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <div className="login-close" onClick={() => setShowLogin(false)}>
            <img src={assets.cross_icon} alt="Close" />
          </div>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            autoComplete={currentState === "Sign Up" ? "new-password" : "current-password"}
          />
        </div>

        {/* Terms (sign up only) */}
        {currentState === "Sign Up" && (
          <div className="login-popup-condition">
            <input type="checkbox" id="terms" required />
            <p>By continuing, I agree to the <strong>Terms of Use</strong> &amp; <strong>Privacy Policy</strong></p>
          </div>
        )}

        {/* Feedback */}
        {message.text && (
          <div className={`login-popup-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Please wait…" : currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Toggle */}
        <p className="login-popup-toggle">
          {currentState === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span onClick={toggleState}>
            {currentState === "Login" ? " Sign up" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;