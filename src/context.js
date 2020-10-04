import React from "react";
import { getCurrentUser } from "./auth/core";

const MyContext = React.createContext(true);

class ContextProvider extends React.Component {
  state = {
    user: null,
    token: null,
  };

  async componentDidMount() {
    const token = localStorage.getItem("my-token");
    if (!token) return this.setState({ token: null, user: "none" });
    this.setState({ token });
    const user = await getCurrentUser(token);
    this.setState({ user });
  }

  setData = (data) => {
    this.setState(data);
  };

  logOut = () => {
    localStorage.removeItem("my-token");

    this.setState({ token: null, user: "none" });
  };

  render() {
    return (
      <MyContext.Provider
        value={{
          ...this.state,
          getUser: this.getUser,
          logout: this.logOut,
          setData: this.setData,
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

const ContextConsumer = MyContext.Consumer;

export { MyContext, ContextProvider, ContextConsumer };
