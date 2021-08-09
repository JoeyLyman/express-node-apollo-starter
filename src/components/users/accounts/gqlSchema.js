const { gql } = require("apollo-server-express");
const mergeGraphqlSchemas = require("merge-graphql-schemas");
const mergeTypes = mergeGraphqlSchemas.mergeTypes;
const mergeResolvers = mergeGraphqlSchemas.mergeResolvers;

const login = require("./mutations/login");
const register = require("./mutations/register");
const update = require("./mutations/update");
const joinWaitlist = require("./mutations/waitlist");
const queries = require("./queries");

const userAccountTypeDefs = gql`
  extend type Query {
    dummy: String
  }

  type User {
    _id: ID!
    username: String!
    name: String
    bio: String
    email: Email!
    phoneNumber: String
    profilePicture: ProfilePicture
    friends: [User]
    friendsIDs: [ID]
    paymentHistory: PaymentHistory!
    lastLogin: Date
    loc: Point
    sharedBuddies: [User]
  }

  type PaymentHistory {
    valid: Boolean
  }

  type Email {
    address: String!
    confirmed: Boolean!
    newAddress: String
  }

  type UserSnippet {
    _id: ID!
    userID: ID!
    username: String!
    profilePictureUrl: String
  }

  enum UserRelation {
    MYSELF
    FRIEND
    OFFERER
    OFFERED
    POTENTIAL
  }

  type UserMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
    relation: UserRelation
  }

  type UserAuthMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
    token: String
  }
`;

const typeDef = mergeTypes([
  userAccountTypeDefs,
  queries.gql.typeDef,
  login.gql.typeDef,
  register.signup.gql.typeDef,
  register.confirmEmail.gql.typeDef,
  update.contactInfo.gql.typeDef,
  update.password.gql.typeDef,
  update.resetPassword.gql.typeDef,
  update.profilePicture.gql.typeDef,
  update.bio.gql.typeDef,
  update.username.gql.typeDef,
  update.name.gql.typeDef,
  update.email.gql.typeDef,
  update.location.gql.typeDef,
  joinWaitlist.gql.typeDef,
]);

const resolvers = mergeResolvers([
  queries.gql.resolvers,
  login.gql.resolvers,
  register.signup.gql.resolvers,
  register.confirmEmail.gql.resolvers,
  update.contactInfo.gql.resolvers,
  update.password.gql.resolvers,
  update.resetPassword.gql.resolvers,
  update.profilePicture.gql.resolvers,
  update.bio.gql.resolvers,
  update.username.gql.resolvers,
  update.name.gql.resolvers,
  update.email.gql.resolvers,
  update.location.gql.resolvers,
  joinWaitlist.gql.resolvers,
]);

module.exports = { typeDef, resolvers };
