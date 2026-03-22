import { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "../Home/Home.css"; // ✅ Reuse Home styling

const Menu = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Menu;
