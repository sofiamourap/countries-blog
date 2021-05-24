import React, { useState, useContext } from "react";
import { Switch, Route } from "react-router-dom";

// apollo boost
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { gql } from "apollo-boost";
// gql
import { ApolloProvider } from "@apollo/react-hooks";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

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
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";
import SingleUser from "./pages/SingleUser";
import SearchResult from "./components/SearchResult";

function App() {
  const { state } = useContext(AuthContext);
  const { user } = state;
  // console.log(user, user.token);

  //create ws link
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  //create http link
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  //setContext for authtoken
  const authLink = setContext(() => {
    return {
      headers: {
        authtoken: user ? user.token : "",
      },
    };
  });

  //concat http and token link
  const httpAuthLink = authLink.concat(httpLink);

  //split http link or ws link
  const link = split(
    ({ query }) => {
      //split link based on operation type
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  // const client = new ApolloClient({
  //   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  //   request: (operation) => {
  //     operation.setContext({
  //       headers: {
  //         authtoken: user ? user.token : "",
  //       },
  //     });
  //   },
  // });

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
        <PrivateRoute
          exact
          path="/post/update/:postid"
          component={PostUpdate}
        />
        <PrivateRoute path="/post/create" component={Post} />
        <Route path="/post/:postid" component={SinglePost} />

        <Route path="/users" component={Users} />
        <Route path="/user/:username" component={SingleUser} />
        <Route path="/search/:query" component={SearchResult} />
        <Route path="/" component={Home} />
      </Switch>
    </ApolloProvider>
  );
}

export default App;
