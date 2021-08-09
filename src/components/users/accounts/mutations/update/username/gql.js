const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateProfileUsernameInput {
    username: String
  }

  extend type Mutation {
    updateProfileUsername(
      input: UpdateProfileUsernameInput
    ): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateProfileUsername(_, { input }, context) {
      return await app.updateProfileUsername(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
