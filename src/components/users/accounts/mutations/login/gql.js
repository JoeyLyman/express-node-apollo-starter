const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  extend type Mutation {
    login(input: LoginInput!): UserAuthMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async login(_, { input: { usernameOrEmail, password } }) {
      return await app.login(usernameOrEmail, password);
    }
  }
};

module.exports = { typeDef, resolvers };
