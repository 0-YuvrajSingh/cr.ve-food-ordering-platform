import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ setShowLogin }) => {
  const { getTotalQuantity } = useContext(StoreContext);
  const { user, logout } = useContext(AuthContext);
  const totalQuantity = getTotalQuantity();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getUserInitial = () =>
    user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      {/* Logo */}
      <Link to="/" className="navbar__logo">
        <img src={assets.logo} alt="CR·VE" />
      </Link>

      {/* Desktop nav links */}
      <ul className="navbar__links">
        <li>
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
        </li>
        <li>
          <Link to="/menu" className={isActive("/menu") ? "active" : ""}>Menu</Link>
        </li>
        <li>
          <a href="#footer">Contact</a>
        </li>
      </ul>

      {/* Right side */}
      <div className="navbar__right">
        {/* Cart */}
        <Link to="/cart" className="navbar__cart" aria-label="Cart">
          <img src={assets.basket_icon} alt="Cart" />
          {totalQuantity > 0 && (
            <span className="navbar__cart-badge badge">{totalQuantity}</span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <div className="navbar__user">
            <div className="navbar__avatar" title={user.email}>
              {getUserInitial()}
            </div>
            <button className="btn btn-ghost navbar__signout" onClick={logout}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary navbar__signin" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        )}

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${mobileMenuOpen ? " open" : ""}`}
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu animate-fade-in">
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link to="/menu" className={isActive("/menu") ? "active" : ""}>Menu</Link>
          <a href="#footer" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <Link to="/cart" className="navbar__mobile-cart">
            🛒 Cart{totalQuantity > 0 && ` (${totalQuantity})`}
          </Link>
          {!user && (
            <button
              className="btn btn-primary"
              onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
            >
              Sign In
            </button>
          )}
          {user && (
            <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
