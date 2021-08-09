const { gql } = require("apollo-server-express");
const bcrypt = require("bcryptjs");

const { client } = require("../../../../../../test/apolloClient");
const mongooseService = require("../../../../../../test/mongoose");
const { User } = require("../../../model");
const { loginUserMutation } = require("../../test/mutations");

// TODO: test the token is the right object? contains correct info / necessary info
// Is everything set to email confirmed true?

describe("Testing the users.accounts.login mutation to:", () => {
  // Setup
  beforeAll(async () => {
    await mongooseService.connect();
    await User.deleteMany();

    // save a user with confirmed email
    const conguyPw = await bcrypt.hash("imconguy", 12);
    const unConguyPw = await bcrypt.hash("imunconguy", 12);

    await User.create({
      username: "ConGuy",
      email: { address: "conguy@conguy.com", confirmed: true },
      password: conguyPw,
    });

    // save a user with unconfirmed email
    await User.create({
      username: "UnConGuy",
      email: { address: "unconguy@unconguy.com", confirmed: false },
      password: unConguyPw,
    });
  });

  afterAll(async () => {
    // await User.deleteMany();
    await mongooseService.disconnect();
  });

  // Tests
  it("throw error for wrong username", async () => {
    await expect(
      client.mutate({
        mutation: gql(loginUserMutation("whoami", "imconguy")),
      })
    ).rejects.toThrowError();
  });
  it("throw error for wrong email", async () => {
    await expect(
      client.mutate({
        mutation: gql(loginUserMutation("whoami@whoami.com", "imconguy")),
      })
    ).rejects.toThrowError();
  });
  describe("registered and email.confirmed: true edge cases:", () => {
    describe("attempt via username", () => {
      it("successfully login", async () => {
        const res = await client.mutate({
          mutation: gql(loginUserMutation("ConGuy", "imconguy")),
        });

        expect(res.data.login.user.email.address).toBe("conguy@conguy.com");
      });
      it("throw error for wrong password", async () => {
        await expect(
          client.mutate({
            mutation: gql(loginUserMutation("ConGuy", "imnotconguy")),
          })
        ).rejects.toThrowError();
      });
    });
    describe("attempt via email", () => {
      it("successfully login", async () => {
        const res = await client.mutate({
          mutation: gql(loginUserMutation("conguy@conguy.com", "imconguy")),
        });

        expect(res.data.login.user.username).toBe("ConGuy");
      });
      it("throw error for wrong password", async () => {
        await expect(
          client.mutate({
            mutation: gql(
              loginUserMutation("conguy@conguy.com", "imnotconguy")
            ),
          })
        ).rejects.toThrowError();
      });
    });
  });
  describe("registered and email.confirmed: false edge cases:", () => {
    it("throw error when attempting login via username", async () => {
      await expect(
        client.mutate({
          mutation: gql(loginUserMutation("UnConGuy", "imunconguy")),
        })
      ).rejects.toThrowError();
    });
    it("throw error when attempting login via email", async () => {
      await expect(
        client.mutate({
          mutation: gql(
            loginUserMutation("unconguy@unconguy.com", "imunconguy")
          ),
        })
      ).rejects.toThrowError();
    });
  });
});
