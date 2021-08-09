const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateEmailInput {
    emailAddress: String
  }

  extend type Mutation {
    updateEmail(input: UpdateEmailInput): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateEmail(_, { input }, context) {
      return await app.updateEmail(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
