import React from "react";
import LogoutButton from "./Logout"
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="App-header">
      <span className="App-title col-11 pr-10">Smoothie Recipe App</span>
      <LogoutButton navigation={navigate}/>
    </header>
  );
}

export default Header;
