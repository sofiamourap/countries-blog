const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");
const { DateTimeResolver } = require("graphql-scalars");
const Post = require("../models/post");
const User = require("../models/user");

// subscriptions
const POST_ADDED = "POST_ADDED";
const POST_UPDATED = "POST_UPDATED";
const POST_DELETED = "POST_DELETED";

//queries
const allPosts = async (parent, args) => {
  const currentPage = args.page || 1;
  const perPage = 6;
  return await Post.find({})
    .skip((currentPage - 1) * perPage)
    .populate("postedBy", "username _id")
    .limit(perPage)
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

//mutations                               context.req
const postCreate = async (parent, args, { req, pubsub }) => {
  const loggedInUser = await authCheck(req);
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

  pubsub.publish(POST_ADDED, { postAdded: newPost });

  return newPost;
};

const postUpdate = async (parent, args, { req, pubsub }) => {
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

  pubsub.publish(POST_UPDATED, {
    postUpdated: updatedPost,
  });
  return updatedPost;
};

const postDelete = async (parent, args, { req, pubsub }) => {
  const loggedInUser = await authCheck(req);
  const currentUser = await User.findOne({
    email: loggedInUser.email,
  });
  const postToDelete = await Post.findById({ _id: args.postId }).exec();
  if (currentUser._id.toString() !== postToDelete.postedBy._id.toString())
    throw new Error("Unauthorized action");
  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId })
    .exec()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());

  pubsub.publish(POST_DELETED, {
    postDeleted: deletedPost,
  });
  return deletedPost;
};

const totalPosts = async (parent, args) =>
  await Post.find({}).estimatedDocumentCount().exec();

const search = async (parent, { query }) => {
  return await Post.find({ $text: { $search: query } })
    .populate("postedBy", "username")
    .exec();
};

module.exports = {
  Query: {
    allPosts,
    postByUser,
    singlePost,
    totalPosts,
    search,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
  Subscription: {
    postAdded: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator([POST_ADDED]),
    },
    postUpdated: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator([POST_UPDATED]),
    },
    postDeleted: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator([POST_DELETED]),
    },
  },
};
