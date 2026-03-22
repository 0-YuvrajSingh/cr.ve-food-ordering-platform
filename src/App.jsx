import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import FakePayment from "./pages/Payment/FakePayment";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><FakePayment /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
