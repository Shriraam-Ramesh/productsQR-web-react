import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/Routing/ErrorPage";
import RoutingPage from "./pages/Routing/RoutingPage";
function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/error-page" exact component={ErrorPage} />
          <RoutingPage />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
