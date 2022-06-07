import React from "react";

const Form = props => {
  return (
    <form onSubmit={props.findRecipe} style={{ marginBottom: "2rem" }} className="btn_right">
      <input className="form__input col-6" type="text" name="search" />
      <button className="form__button">Search</button>
    </form>
  );
};

export default Form;
