import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu__header">
        <h1>Explore Our Menu</h1>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes. Our mission
          is to satisfy your cravings and elevate your dining experience, one meal at a time.
        </p>
      </div>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div
            key={index}
            className="explore-menu-list-item"
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name
              )
            }
          >
            <img
              src={item.menu_image}
              className={category === item.menu_name ? "active" : ""}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>

      <hr className="explore-menu__divider" />
    </div>
  );
};

export default ExploreMenu;
