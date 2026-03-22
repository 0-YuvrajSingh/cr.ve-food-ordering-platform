import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);

  return user ? (
    <div className="user-menu">
      <p>Welcome, <strong>{user.email.split("@")[0]}</strong></p>
      <button onClick={logout}>Logout</button>
    </div>
  ) : null;
};

export default UserMenu;