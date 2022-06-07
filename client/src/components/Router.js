import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App";
import LoginForm from "./Login";
import Recipe from "./Recipe";
import RecipeForm from "./RecipeForm";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} exact />
        <Route path="/smoothies" element={<App />} exact />
        <Route path="/smoothie/new" element={<RecipeForm />} />
        <Route path="/smoothie/:recipeId" element={<Recipe />} />
        <Route path="/smoothie/:recipeId/edit" element={<RecipeForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
