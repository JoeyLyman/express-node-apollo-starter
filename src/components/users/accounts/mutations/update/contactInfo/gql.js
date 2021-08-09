const { gql } = require("apollo-server-express");

const app = require("./app");

const typeDef = gql`
  input UpdateContactInfoInput {
    email: String
    phoneNumber: String
  }

  extend type Mutation {
    updateContactInfo(input: UpdateContactInfoInput): UserMutationResponse!
  }
`;

const resolvers = {
  Mutation: {
    async updateContactInfo(_, { input: { email, phoneNumber } }, context) {
      return await app.updateContactInfo(context, email, phoneNumber);
    }
  }
};

module.exports = { typeDef, resolvers };
