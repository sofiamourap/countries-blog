import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import UserCard from "../components/UserCard";

const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      username
      name
      email
      images {
        url
        public_id
      }
      about
    }
  }
`;

export default function SingleUser() {
  let params = useParams();
  const { loading, data } = useQuery(PUBLIC_PROFILE, {
    variables: { username: params.username },
  });

  if (loading) return <h4 className="p-5">Loading...</h4>;
  return (
    <div className="container">
      <br />
      <br />
      <UserCard user={data.publicProfile} />
    </div>
  );
}
