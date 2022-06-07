import React, { Component } from "react";
import { Link } from "react-router-dom";
import { axiosHelper } from "./utils";

import Form from "./components/Form";
import Recipes from "./components/Recipes";
import Header from "./components/Header";
import "./App.css";

class App extends Component {
  state = {
    recipes: []
  };
  componentDidMount() {
    const jsonStr = localStorage.getItem("recipes");
    if (jsonStr) {
      const recipes = JSON.parse(jsonStr);
      this.setState({ recipes });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // stringify state to store in localStorage
    const recipes = JSON.stringify(this.state.recipes);
    localStorage.setItem("recipes", recipes);
  }

  findRecipe = async e => {
    const searchQuery = e.target.elements.search.value;
    e.preventDefault();
    const opts = {
      url: '/api/getSmoothies'
    }
    if (searchQuery) {
      opts.url = '/api/findSmoothies';
      opts.data = { query: searchQuery };
      opts.method = 'post';
    }
    const { data } = await axiosHelper(opts);
      console.log("result data", data)
    this.setState({
      recipes: data
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="row">
          <div className="col">
            <Form findRecipe={this.findRecipe} />
          </div>
          <div className="col-4">
            <Link to={'/smoothie/new'} className="form__button btn float-left">New Recipe</Link>
          </div>
        </div>
        <Recipes recipes={this.state.recipes} />
      </div>
    );
  }
}

export default App;
