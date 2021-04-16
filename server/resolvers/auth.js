const { gql } = require("apollo-server-express");

const me = () => "Sofia";

module.exports = {
  Query: {
    me,
  },
};
