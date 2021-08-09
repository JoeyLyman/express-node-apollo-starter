const { gql } = require("apollo-server-express");

const { client, getClient } = require("../../../../../../test/apolloClient");
const mongooseService = require("../../../../../../test/mongoose");
const { User } = require("../../../model");
const confirmEmail = require("../../register/confirmEmail");
const {
  signupUserMutation,
  loginUserMutation,
  changePasswordMutation
} = require("../../test/mutations");

jest.setTimeout(30000);

describe("Testing the users.accounts.changePassword mutation to:", () => {
  // Setup
  let clientWithAuth = {};

  beforeAll(async () => {
    // Setup mongo schema connections
    await mongooseService.connect();
    // Clear database
    await User.deleteMany();
    await confirmEmail.model.ConfirmEmailToken.deleteMany();

    // Signup "Mason" user for tests
    await client.mutate({
      mutation: gql(signupUserMutation("Mason", "Mason@Mason.com"))
    });

    // Confirm Mason's email so that he can log in
    await User.findOneAndUpdate(
      { username: "Mason" },
      { "email.confirmed": true }
    );

    // Login "Mason" (get a token)
    const resFromLogin = await client.mutate({
      mutation: gql(loginUserMutation("Mason", "bobrocks"))
    });

    // Create apollo client that has authentication header set to token
    clientWithAuth = getClient(resFromLogin.data.login.token);
  });

  afterAll(async () => {
    await mongooseService.disconnect();
  });

  // Tests
  describe("user is authorized edge cases:", () => {
    it("successfully change password", async () => {
      // Test requires 3 stages
      expect.assertions(3);

      // Login with old password:
      const firstLoginRes = await client.mutate({
        mutation: gql(loginUserMutation("Mason", "bobrocks"))
      });

      expect(firstLoginRes.data.login.user.username).toBe("Mason");

      // Change password
      const changePassRes = await clientWithAuth.mutate({
        mutation: gql(changePasswordMutation("imanewguy", "imanewguy"))
      });

      expect(changePassRes.data.changePassword.user.username).toBe("Mason");

      // Attempt login to Mason with new password (client that is not logged in / no auth token)
      const secondLoginRes = await client.mutate({
        mutation: gql(loginUserMutation("Mason", "imanewguy"))
      });

      expect(secondLoginRes.data.login.user.email.address).toBe(
        "Mason@Mason.com"
      );
    }, 30000);

    it("throw error if newPassword and newConfirmPassword do not match", async () => {
      // NOT WORKING
      await expect(
        clientWithAuth.mutate({
          mutation: gql(changePasswordMutation("a password", "a Password"))
        })
      ).rejects.toThrowError();
    }, 30000);

    it("throw error if newPassword and newConfirmPassword are blank", async () => {
      await expect(
        clientWithAuth.mutate({
          mutation: gql(changePasswordMutation("", ""))
        })
      ).rejects.toThrowError();
    }, 30000);
  });

  // If user is not authorized (use client without authorization header)
  describe("user is not authorized edge cases:", () => {
    it("throw error", async () => {
      await expect(
        client.mutate({
          mutation: gql(changePasswordMutation("imanewguy", "imanewguy"))
        })
      ).rejects.toThrowError();
    }, 30000);
  }, 30000);
}, 30000);
