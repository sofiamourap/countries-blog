const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const { DateTimeResolver } = require("graphql-scalars");
const Post = require("../models/post");
const User = require("../models/user");

//queries
const allPosts = async (parent, args) => {
  return await Post.find({}).exec();
};

const postByUser = async (parent, args, { req }) => {
  const loggedInUser = await authCheck(req);
  const currentUser = await User.findOne({
    email: loggedInUser.email,
  }).exec();
  return await Post.find({ postedBy: currentUser })
    .populate("postedBy", "_id username")
    .sort({ createdAt: -1 });
};

//mutations                          context.req
const postCreate = async (parent, args, { req }) => {
  const loggedInUser = await authCheck(req);
  //validation
  if (args.input.content.trim() === "") throw new Error("Content is required");
  const currentUser = await User.findOne({
    email: loggedInUser.email,
  });
  let newPost = await new Post({
    ...args.input,
    postedBy: currentUser._id,
  })
    .save()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());

  return newPost;
};

module.exports = {
  Query: {
    allPosts,
    postByUser,
  },
  Mutation: {
    postCreate,
  },
};
