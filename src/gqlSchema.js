const { makeExecutableSchema } = require("graphql-tools");
const { gql } = require("apollo-server-express");
const fs = require("fs");

const util = require("./util");
const components = require("./components");

// If you had Query fields not associated with a specific type you could put them here
const Query = gql`
  type ResponseCount {
    value: Int
  }

  type Query {
    readError: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
`;

const resolvers = {
  Query: {
    readError: (parent, args, context) => {
      fs.readFileSync("/does/not/exist");
    },
  },
  MutationResponse: {
    __resolveType(mutationResponse, context, info) {
      return null;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: [
    Query,
    components.users.accounts.gql.typeDef,
    components.users.buddyUpdates.gql.typeDef,
    util.dates.gql.typeDef,
    util.locations.gql.typeDef,
    util.gqlTypes.json.typeDef,
  ],
  resolvers: [
    resolvers,
    components.users.accounts.gql.resolvers,
    components.users.buddyUpdates.gql.resolvers,
    util.dates.gql.resolvers,
    util.gqlTypes.json.resolvers,
  ],
});

module.exports = { schema };
