import React from "react";

import { Link } from "react-router-dom";

const Recipes = props => {
  return (
    <div className="container">
      <div className="row">
        {props.recipes.map((recipe, idx) => {
          return (
            <div
              key={idx}
              className="col-md-4"
              style={{ marginBottom: "2rem" }}
            >
              <div className="recipes__box">
                <div className="recipe__text">
                  <h5 className="recipes__title">
                    {recipe.name}
                  </h5>
                  <p className="recipes__subtitle">
                    <span>{recipe.description}</span>
                  </p>
                </div>
                <button className="recipe__buttons">
                  <Link to={`/smoothie/${recipe.recipe_id}`}>
                    View Recipe
                  </Link>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recipes;
