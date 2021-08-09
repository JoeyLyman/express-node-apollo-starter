const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input GetUserProfileInput {
    username: String!
  }

  type SearchUsersResponse {
    myself: [User]
    buddies: [User]
    offersSent: [User]
    offersReceived: [User]
    potentials: [User]
  }

  input SearchUsersInput {
    skip: Int
    limit: Int
    searchText: String!
    sortOrder: String
    includeMyself: Boolean
    includeBuddies: Boolean
    includeOffersReceived: Boolean
    includeOffersSent: Boolean
    includePotentials: Boolean
  }

  extend type Query {
    getMyProfile: UserMutationResponse!
    getUserProfile(input: GetUserProfileInput): UserMutationResponse!
    searchUsers(input: SearchUsersInput): SearchUsersResponse
  }
`;

const resolvers = {
  Query: {
    getMyProfile: async (_, __, context) => {
      return await app.getMyProfile(context);
    },
    getUserProfile: async (_, { input }, context) => {
      return await app.getUserProfile(context, input);
    },
    searchUsers: async (_, { input }, context) => {
      return await app.searchUsers(context, input);
    },
  },
  User: {
    friends: async (root, input, context) => {
      return app.getMyFriends(context);
    },
    sharedBuddies: async (root, { input }, context) => {
      return app.getSharedBuddies(context, root._id);
    },
    // TODO: friendRequests: [User]
  },
};

module.exports = { typeDef, resolvers };
