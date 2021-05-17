const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    _id: ID!
    content: String
    image: Image
    postedBy: User
  }

  input PostCreateInput {
    content: String!
    image: ImageInput
  }

  type Query {
    allPosts: [Post!]!
    postByUser: [Post!]!
  }

  type Mutation {
    postCreate(input: PostCreateInput!): Post!
  }
`;
