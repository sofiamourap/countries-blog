import React, { useState, useContext } from "react";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";
import { GET_ALL_POSTS } from "../graphql/queries";

function Home() {
  const [fetchPosts, { data: posts, loading: loadingData, error: errorData }] =
    useLazyQuery(GET_ALL_POSTS);
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  //access context
  const { state, dispatch } = useContext(AuthContext);

  //react router
  let history = useHistory();

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card">
                <div className="card-body">
                  <div className="card-title">
                    <h4>{p.title}</h4>
                  </div>
                  <p className="card-text">{p.description}</p>
                  <hr />
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="row p-5">
        <button
          onClick={() => fetchPosts()}
          className="btn-btn-raised btn-primary"
        >
          Fetch posts
        </button>
      </div>
      <hr />
      {JSON.stringify(state.user)}
      <hr />

      {/* <hr />
      {JSON.stringify(history)} */}
    </div>
  );
}

export default Home;
