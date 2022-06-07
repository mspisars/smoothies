import React from "react";

// Define the logout button component
class LogoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    const jsonStr = localStorage.getItem("user");
    if (jsonStr) {
      const user = JSON.parse(jsonStr);
      this.setState({ loggedIn: !!user.token });
    }
  }
  
  handleClick(e) {
    e.preventDefault();
    localStorage.removeItem("user");
    this.props.navigation('/', {replace: true});
  }

  render() {
    return this.state.loggedIn ? (
      <button
        id="logout-button btn_right fixed-top"
        onClick={this.handleClick}
      >
        Log out
      </button>
    ) : '';
  }
}

export default LogoutButton;
