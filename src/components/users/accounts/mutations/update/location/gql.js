const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateProfileLocationInput {
    coordinates: [Float]
    nearestLocation: NearestLocationInput
  }

  input NearestLocationInput {
    coordinates: [Float]
    placeType: [String]
    text: String
  }

  extend type Mutation {
    updateProfileLocation(
      input: UpdateProfileLocationInput
    ): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateProfileLocation(_, { input }, context) {
      return await app.updateProfileLocation(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
