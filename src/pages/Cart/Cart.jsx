import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, Link } from "react-router-dom";

export const deliveryFee = 2;

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  } = useContext(StoreContext);

  const totalQuantity = getTotalQuantity();
  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : deliveryFee;
  const total = subtotal + delivery;
  const navigate = useNavigate();

  const cartFoods = food_list.filter((item) => cartItems[item._id] > 0);

  return (
    <div className="cart">
      {/* Heading */}
      <div className="cart__heading">
        <h2>Your Cart</h2>
        {totalQuantity > 0 && (
          <span className="badge">{totalQuantity} item{totalQuantity !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Items */}
      <div className="cart-items">
        {totalQuantity === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any dishes yet. Browse our menu to get started!</p>
            <Link to="/menu" className="btn btn-primary" style={{ marginTop: "8px" }}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="cart-items-header">
              <span></span>
              <span>Item</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Remove</span>
            </div>

            {/* Item rows */}
            {cartFoods.map((item) => (
              <div className="cart-item-row" key={item._id}>
                <img src={item.image} alt={item.name} />
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>

                {/* Quantity stepper */}
                <div className="cart-stepper">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove one"
                  >
                    −
                  </button>
                  <span>{cartItems[item._id]}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(item._id)}
                    aria-label="Add one"
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-total">
                  ${(item.price * cartItems[item._id]).toFixed(2)}
                </p>

                <div className="cart-item-remove">
                  <button
                    type="button"
                    onClick={() => {
                      // Remove all quantities of this item
                      for (let i = 0; i < cartItems[item._id]; i++) {
                        removeFromCart(item._id);
                      }
                    }}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom: promo + totals */}
      {totalQuantity > 0 && (
        <div className="cart-bottom">
          {/* Promo code */}
          <div className="cart-promo">
            <h3>Have a promo code?</h3>
            <p>Enter your discount code below and save on your order.</p>
            <div className="cart-promo-input">
              <input type="text" placeholder="e.g. CRVE20" />
              <button type="button">Apply</button>
            </div>
          </div>

          {/* Order summary */}
          <div className="cart-total">
            <h2>Order Summary</h2>
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
            <button
              className="cart-checkout-btn"
              disabled={subtotal === 0}
              onClick={() => navigate("/order")}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
