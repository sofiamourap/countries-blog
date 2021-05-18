const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const { DateTimeResolver } = require("graphql-scalars");
const Post = require("../models/post");
const User = require("../models/user");

//queries
const allPosts = async (parent, args) => {
  return await Post.find({})
    .populate("postedBy", "username _id")
    .sort({ createdAt: -1 })
    .exec();
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

const singlePost = async (parent, args) => {
  return await Post.findById({ _id: args.postId })
    .populate("postedBy", "_id username")
    .exec();
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

const postUpdate = async (parent, args, { req }) => {
  const loggedInUser = await authCheck(req);
  //validation
  if (args.input.content.trim() === "") throw new Error("Content is required");
  // get current user _id in mongodb based in email
  const currentUser = await User.findOne({ email: loggedInUser.email }).exec();
  //_id of post to update
  const postToUpdate = await Post.findById({ _id: args.input._id }).exec();
  //if currentuser id and id of the postedBy user id is the same, allow update
  if (currentUser._id.toString() !== postToUpdate.postedBy._id.toString())
    throw new Error("Unauthorized action");
  let updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    {
      ...args.input,
    },
    { new: true }
  )
    .exec()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());
  return updatedPost;
};

const postDelete = async (parent, args, { req }) => {
  const loggedInUser = await authCheck(req);
  const currentUser = await User.findOne({
    email: loggedInUser.email,
  });
  const postToDelete = await Post.findById({ _id: args.postId }).exec();
  if (currentUser._id.toString() !== postToDelete.postedBy._id.toString())
    throw new Error("Unauthorized action");
  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();
  return deletedPost;
};

module.exports = {
  Query: {
    allPosts,
    postByUser,
    singlePost,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
};
