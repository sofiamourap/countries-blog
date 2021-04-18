const { gql } = require("apollo-server-express");
const { authCheck } = require("../helpers/auth");

// const me = (parent, args, context) => {
const me = async (parent, args, { req, res }) => {
  await authCheck(req);
  return "Sofia";
};

module.exports = {
  Query: {
    me,
  },
};
