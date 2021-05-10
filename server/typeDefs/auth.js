const { gql } = require("apollo-server-express");

module.exports = gql`
  type Query {
    me: String!
  }

  type Image {
    url: String
    public_id: String
  }

  type User {
    _id: ID!
    username: String
    name: String
    email: String
    about: String
    images: [Image]
    createdAt: String
    updatedAt: String
  }

  # custom type
  type UserCreateResponse {
    username: String!
    email: String!
  }

  # input type

  input ImageInput {
    url: String
    public_id: String
  }

  input UserUpdateInput {
    username: String
    name: String
    about: String
    images: [ImageInput]
  }

  type Mutation {
    userCreate: UserCreateResponse!
    userUpdate(input: UserUpdateInput): User!
  }
`;
