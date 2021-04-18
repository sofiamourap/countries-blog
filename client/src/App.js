import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { Switch, Route } from "react-router-dom";
import { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Register from "./auth/Register";
import Login from "./auth/Login";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

function App() {
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

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </ApolloProvider>
  );
}

export default App;
