import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosHelper } from "../utils";
import Header from "./Header";

const Recipe = props => {
  const [activeRecipe, setActiveRecipe] = useState([]);
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { id, name, description, serving, username, ingredients, instructions } = activeRecipe;

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await axiosHelper({
        url: `/api/getSmoothie/${recipeId}`
      });
      setActiveRecipe(data);
    };
    fetchRecipe();
  }, [recipeId]);

  // to back go to previous page
  const goHome = () => navigate('/smoothies', { replace: true });
  const deleteRecipe = async () => {
    const { data } = await axiosHelper({
      url: `/api/Recipe/${id}`,
      method: 'delete',
    });
    console.log("DELETE", data);

    if (data) navigate('/smoothies', { replace: true });
  };

  const publishRecipe = async () => {
    const { data } = await axiosHelper({
      url: `/api/publishRecipe`,
      method: 'post',
      data: { 
        url: recipeId,
        id
      }
    });
    
    if (data) {
      setActiveRecipe({ ...activeRecipe, published: data });
    }
    console.log("PUBLISH", data, activeRecipe);
  };

  return (
    <div className="App">
      <Header />
      <div className="container">

        {activeRecipe.length !== 0 && (
          <div className="active-recipe">
            <h3 className="active-recipe__title">{name}</h3>
            <h4 className="active-recipe__publisher">
              By: <span>{username}</span> Serving: <span>{serving}</span>
            </h4>
            <p className="active-recipe__website">
              <span>
                {description}
              </span>
            </p>
            <div className="container p-0">
              <button onClick={goHome} className="active-recipe__button">
                Back
              </button>
              <button className="active-recipe__button">
                <Link to={`/smoothie/${recipeId}/edit`}
                    state={{ activeRecipe }} >
                  Edit Recipe
                </Link>
              </button>
              {recipeId && !activeRecipe.published && (
                <button onClick={publishRecipe} className="active-recipe__button">
                  Publish Recipe
                </button>
              )}
              <button onClick={deleteRecipe} className="active-recipe__button btn_right">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                </svg>
                {" "}
                Delete Recipe
              </button>
            </div>
            {recipeId && activeRecipe.published && (
              <>
                <br />
                <div className="container p-0 active-recipe__publisher">
                  <div className="row">
                    <div className="col">
                      Public URL: <span> {window.location.origin}/shared/{activeRecipe.published.url}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="container p-0 active-recipe__publisher">
              <div className="row">
                <div className="col">
                  <h5>Ingredients</h5>
                  {ingredients.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <span> {item.quantity} { item.uom } - { item.name }</span>
                        <br /><p>{ item.description }</p>
                      </div>
                    );
                  })}
                </div>
                <div className="col">
                  <h5>Instructions</h5>
                  {instructions.map((item, idx) => {
                    return (
                      <div key={idx}>
                        <span> [{item.sequence}] - {item.description}</span>
                        <br />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;
