const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input SignupInput {
    signupCode: String!
    username: String!
    email: String!
    phoneNumber: String
    password: String!
    confirmPassword: String!
  }

  extend type Mutation {
    signup(input: SignupInput!): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    //prettier-ignore
    async signup(_, { input: { username, email, phoneNumber, password, confirmPassword, signupCode } }) {

      return await app.signup(
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
        signupCode
      );
    },
  },
};

module.exports = { typeDef, resolvers };
