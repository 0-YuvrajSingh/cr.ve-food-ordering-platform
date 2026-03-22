import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="hero">
      <div className="hero__overlay" />
      <div className="hero__content animate-fade-in">
        <span className="hero__pill">🔥 Free delivery on your first order</span>
        <h1 className="hero__title">
          Satisfy Every Craving<br />with CR<span className="dot">·</span>VE
        </h1>
        <p className="hero__subtitle">
          Chef-curated dishes made with bold flavors and fresh ingredients —
          delivered fast to your door.
        </p>
        <div className="hero__actions">
          <button className="btn btn-primary hero__cta" onClick={() => navigate("/menu")}>
            Explore Menu →
          </button>
          <a href="#explore-menu" className="btn btn-secondary hero__scroll">
            Browse Categories
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
