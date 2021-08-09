const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input ChangePasswordInput {
    newPassword: String!
    newConfirmPassword: String!
  }

  extend type Mutation {
    changePassword(input: ChangePasswordInput): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    //prettier-ignore
    async changePassword(_, { input: { newPassword, newConfirmPassword } }, context) {
      // console.log(`context:`, context);
      return await app.changePassword(context, newPassword, newConfirmPassword);
    }
  }
};

module.exports = { typeDef, resolvers };
