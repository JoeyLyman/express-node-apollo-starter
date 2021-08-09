const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateProfileBioInput {
    bio: String
  }

  extend type Mutation {
    updateProfileBio(input: UpdateProfileBioInput): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateProfileBio(_, { input }, context) {
      return await app.updateProfileBio(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
