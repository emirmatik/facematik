import React from "react";
import "./App.css";
import { Signup, Login, Home, Profile, Search, Notifications } from "./pages";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/Profile/:username" component={Profile}></Route>

        <Route path="/register" exact>
          <Signup />
        </Route>

        <Route path="/login" exact>
          <Login />
        </Route>

        <Route path="/search" exact>
          <Search />
        </Route>

        <Route path="/notifications" exact>
          <Notifications />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
