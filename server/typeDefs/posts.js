const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    _id: ID!
    content: String
    image: Image
    postedBy: User
    country: String
  }

  input PostCreateInput {
    content: String!
    image: ImageInput
    country: String!
  }

  input PostUpdateInput {
    _id: String!
    content: String!
    image: ImageInput
    country: String!
  }

  type Query {
    allPosts(page: Int): [Post!]!
    postByUser: [Post!]!
    singlePost(postId: String!): Post!
    totalPosts: Int!
    search(query: String): [Post]
  }

  type Mutation {
    postCreate(input: PostCreateInput!): Post!
    postUpdate(input: PostUpdateInput!): Post!
    postDelete(postId: String!): Post!
  }
`;
