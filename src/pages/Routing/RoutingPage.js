import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AddProducts from "../AddProducts";
import LandingPage from "../LandingPage";
import ProductList from "../ProductList";
const RoutingPage = () => {
  let authCheck = true;
  return (
    <div>
      <Switch>
        <PrivateRoute
          exact
          path="/"
          component={LandingPage}
          authCheck={authCheck}
        />
        <PrivateRoute
          exact
          path="/add-product"
          component={AddProducts}
          authCheck={authCheck}
        />
        <PrivateRoute
          exact
          path="/products-list"
          component={ProductList}
          authCheck={authCheck}
        />
        <Redirect to="/error-page" />
      </Switch>
    </div>
  );
};
export default RoutingPage;
var PrivateRoute = ({ component: Components, authCheck, ...props }) => {
  console.log(props);
  return (
    <Route
      {...props}
      render={(props) =>
        authCheck ? (
          <Components {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
