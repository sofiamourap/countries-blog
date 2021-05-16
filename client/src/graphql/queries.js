import { USER_INFO } from "./fragments";
import { gql } from "apollo-boost";

export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const GET_ALL_POSTS = gql`
  {
    allPosts {
      id
      title
      description
    }
  }
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;
