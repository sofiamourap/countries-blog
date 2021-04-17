import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Home from "./components/Home";
import NavBar from "./components/NavBar";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <NavBar />
      <Home />
    </ApolloProvider>
  );
}

export default App;
