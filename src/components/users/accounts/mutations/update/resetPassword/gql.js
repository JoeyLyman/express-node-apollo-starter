const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input SendResetPasswordEmailInput {
    email: String!
  }
  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  type ForgotPasswordMutationResponse {
    code: String!
    success: Boolean!
    message: String!
    email: String
  }

  extend type Mutation {
    sendResetPasswordEmail(
      input: SendResetPasswordEmailInput
    ): ForgotPasswordMutationResponse!
    resetPassword(input: ResetPasswordInput!): UserAuthMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    //prettier-ignore
    async sendResetPasswordEmail(_, { input: { email } }) {
      return await app.sendResetPasswordEmail(
        email
      );
    },
    //prettier-ignore
    async resetPassword(_, { input: { token, newPassword } }) {
      return await app.resetPassword(
        token, newPassword
      );
    }
  },
};

module.exports = { typeDef, resolvers };
