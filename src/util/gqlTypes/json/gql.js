const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");
const { gql } = require("apollo-server-express");

const typeDef = gql`
  scalar JSON
  scalar JSONObject
`;

const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

module.exports = { typeDef, resolvers };
