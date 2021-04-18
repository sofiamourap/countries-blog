import React, { useState, useContext } from "react";
import ApolloClient from "apollo-boost";
import { Switch, Route } from "react-router-dom";
import { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";
//components
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Register from "./auth/Register";
import Login from "./auth/Login";
import CompleteRegistration from "./auth/CompleteRegistration";
import { AuthContext } from "./context/authContext";

function App() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  // console.log(user, user.token);

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    request: (operation) => {
      operation.setContext({
        headers: {
          authtoken: user ? user.token : "",
        },
      });
    },
  });

  return (
    <ApolloProvider client={client}>
      <NavBar />
      <ToastContainer />
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/complete-registration">
          <CompleteRegistration />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </ApolloProvider>
  );
}

export default App;
