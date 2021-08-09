const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input JoinWaitlistInput {
    email: String!
  }

  type JoinedWaitlistMutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  extend type Mutation {
    joinWaitlist(input: JoinWaitlistInput!): JoinedWaitlistMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async joinWaitlist(_, { input: { email } }) {
      return await app.joinWaitlist(email);
    },
  },
};

module.exports = { typeDef, resolvers };
