const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input BuddyUpdateInput {
    buddyID: ID!
  }

  type BuddyUpdateMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
    buddy: User
  }

  extend type Mutation {
    offerBuddy(input: BuddyUpdateInput!): BuddyUpdateMutationResponse!
    removeBuddy(input: BuddyUpdateInput!): BuddyUpdateMutationResponse!
    acceptBuddyOffer(input: BuddyUpdateInput!): BuddyUpdateMutationResponse!
    denyBuddyOffer(input: BuddyUpdateInput!): BuddyUpdateMutationResponse!
    cancelBuddyOffer(input: BuddyUpdateInput!): BuddyUpdateMutationResponse!
  }
`;

const resolvers = {
  Query: {
    // async getFriends(_, __, context) {
    //   return await app.getFriends(context);
    // },
  },
  Mutation: {
    async offerBuddy(_, { input }, context) {
      return await app.offerBuddy(input, context);
    },
    async removeBuddy(_, { input }, context) {
      return await app.removeBuddy(input, context);
    },
    async acceptBuddyOffer(_, { input }, context) {
      return await app.acceptBuddyOffer(input, context);
    },
    async denyBuddyOffer(_, { input }, context) {
      return await app.denyBuddyOffer(input, context);
    },
    async cancelBuddyOffer(_, { input }, context) {
      return await app.cancelBuddyOffer(input, context);
    },
  },
};

module.exports = { typeDef, resolvers };
