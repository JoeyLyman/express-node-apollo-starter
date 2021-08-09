const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  type ResendConfirmEmailEmailMutationResponse {
    code: String!
    success: Boolean!
    message: String!
    email: String
  }
  input ConfirmEmailInput {
    token: String
  }

  input ResendConfirmEmailEmailInput {
    email: String
  }

  input ReceivedEmailByMistakeInput {
    token: String
  }

  extend type Mutation {
    confirmEmail(input: ConfirmEmailInput!): UserAuthMutationResponse!
    resendConfirmEmailEmail(
      input: ResendConfirmEmailEmailInput!
    ): ResendConfirmEmailEmailMutationResponse!
    receivedConfirmEmailEmailByMistake(
      input: ReceivedEmailByMistakeInput
    ): MutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async confirmEmail(_, { input: { token } }) {
      return await app.confirmEmail(token);
    },

    async resendConfirmEmailEmail(_, { input: { email } }) {
      return await app.resendConfirmEmailEmail(email);
    },
    async receivedConfirmEmailEmailByMistake(_, { input: { token } }) {
      return await app.receivedEmailByMistake(token);
    },
  },
};

module.exports = { typeDef, resolvers };
