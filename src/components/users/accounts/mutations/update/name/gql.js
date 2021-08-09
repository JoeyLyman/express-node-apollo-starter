const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateProfileNameInput {
    name: String
  }

  extend type Mutation {
    updateProfileName(input: UpdateProfileNameInput): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateProfileName(_, { input }, context) {
      return await app.updateProfileName(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
