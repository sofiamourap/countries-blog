import React, { useState, useContext } from "react";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { ALL_USERS } from "../graphql/queries";

function Users() {
  const { data, loading, error } = useQuery(ALL_USERS);
  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allUsers.map((u) => (
            <div className="col-md-4" key={u._id}>
              <div className="card">
                <div className="card-body">
                  <div className="card-title">
                    <h4>{u.username}</h4>
                  </div>
                  <p className="card-text">{u.about}</p>
                  <hr />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Users;
