const { gql } = require("apollo-server-express");
const { createWriteStream } = require("fs");
const path = require("path");

const app = require("./app");

const typeDef = gql`
  type ProfilePicture {
    url: String
    publicID: String
  }

  input UpdateProfilePictureUrlInput {
    url: String
    publicID: String
  }

  extend type Mutation {
    updateProfilePictureUrl(
      input: UpdateProfilePictureUrlInput
    ): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    updateProfilePictureUrl: async (_, { input }, context) => {
      return await app.updateProfilePictureUrl(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
