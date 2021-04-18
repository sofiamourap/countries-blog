const { gql } = require("apollo-server-express");
const shortid = require("shortid");
const { authCheck } = require("../helpers/auth");
const User = require("../models/user");

// const me = (parent, args, context) => {
const me = async (parent, args, { req, res }) => {
  await authCheck(req);
  return "Sofia";
};

const userCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const user = await User.findOne({ email: currentUser.email });
  return user
    ? user
    : new User({
        email: currentUser.email,
        username: shortid.generate(),
      }).save();
};

module.exports = {
  Query: {
    me,
  },
  Mutation: {
    userCreate,
  },
};
