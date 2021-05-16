import React, { useState, useContext } from "react";
import { Switch, Route } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ToastContainer } from "react-toastify";
//components
import Home from "./pages/Home";
import Users from "./pages/Users";
import NavBar from "./components/NavBar";
import Register from "./pages/auth/Register";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import PasswordForgot from "./pages/auth/PasswordForgot";
import Profile from "./pages/auth/Profile";
import Login from "./pages/auth/Login";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Post from "./pages/post/Post";
import SingleUser from "./pages/SingleUser";

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
        <PublicRoute path="/register" component={Register} />
        <PublicRoute path="/login" component={Login} />
        <Route path="/complete-registration" component={CompleteRegistration} />
        <Route path="/password/forgot" component={PasswordForgot} />
        <PrivateRoute path="/password/update" component={PasswordUpdate} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/post/create" component={Post} />
        <Route path="/users" component={Users} />
        <Route path="/user/:username" component={SingleUser} />
        <Route path="/" component={Home} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
