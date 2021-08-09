const { gql } = require("apollo-server-express");

const { client } = require("../../../../../../test/apolloClient");
const mongooseService = require("../../../../../../test/mongoose");
const { User } = require("../../../model");
const confirmEmail = require("../confirmEmail");
const { signupUserMutation } = require("../../test/mutations");

// TODO: Test for bad phone numbers
// TODO: ensure signup doesnt go through, when errors are thrown (cuz errors are thrown after we talk to DB)
// TODO: also, for each signup test, do User.find and do 2 expects and have it be the right model that comes back, the right quantity of documents, etc

// Tests
describe("Testing the users.accounts.signup mutation to:", () => {
  // Setup
  beforeAll(async () => {
    await mongooseService.connect();
    await User.deleteMany();
    await confirmEmail.model.ConfirmEmailToken.deleteMany();
  });

  afterAll(async () => {
    await mongooseService.disconnect();
  });

  // Tests
  it("successfully signup a user if credentials are valid and novel", async () => {
    const res = await client.mutate({
      mutation: gql(signupUserMutation("Kelly", "kelly@kelly.com"))
    });

    expect(res.data.signup.user.username).toBe("Kelly");
  });

  // Username edge cases
  describe("username edge cases:", () => {
    describe("username is taken:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("Kelly", "null@null.com"))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "Kelly",
          "email.address": "null@null.com"
        });
        expect(users.length).toBe(0);
      });

      it("not mutate original user (NOT FINISHED)", async () => {
        // TODO: check that all fields weren't mutated, not just email
        const users = await User.find({
          username: "Kelly",
          "email.address": "kelly@kelly.com"
        });
        expect(users.length).toBe(1);
      });
    });
    describe("username is empty:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("", "null@null.com"))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: ""
        });
        expect(users.length).toBe(0);
      });
    });
    describe("username contains @:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("@null", "null@null.com"))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "@null"
        });
        expect(users.length).toBe(0);
      });
    });
  });

  // Email tests
  describe("email edge cases:", () => {
    describe("email is empty:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("John", ""))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "John"
        });
        expect(users.length).toBe(0);
      });
    });

    describe("email is invalid:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("John", "johnsemailaddress"))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "John"
        });
        expect(users.length).toBe(0);
      });
    });

    describe("where email is signed up with another account, but isn't confirmed:", () => {
      it("successfully signup user", async () => {
        expect.assertions(2);
        const res = await client.mutate({
          mutation: gql(signupUserMutation("John", "kelly@kelly.com"))
        });

        const allUsersWithThatEmail = await User.find({
          "email.address": "kelly@kelly.com"
        });
        expect(allUsersWithThatEmail.length).toBe(2);
        expect(res.data.signup.user.username).toBe("John");
      });
    });

    describe("where email is signuped with another account, and confirmed:", () => {
      beforeAll(async () => {
        // Set Kelly's email address to "confirmed"
        await User.findOneAndUpdate(
          { username: "Kelly" },
          { $set: { "email.confirmed": true } }
        );
      });

      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("Mick", "kelly@kelly.com"))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "Mick",
          "email.address": "kelly@kelly.com"
        });
        expect(users.length).toBe(0);
      });

      it("not mutate the already existing account (NOT FINISHED)", async () => {
        // TODO: check that all fields weren't mutated, not just email
        const users = await User.find({
          username: "Kelly",
          "email.address": "kelly@kelly.com"
        });
        expect(users.length).toBe(1);
      });
    });
  });

  // Password tests
  describe("password edge cases:", () => {
    describe("password is empty:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(signupUserMutation("Dane", "dane@dane.com", ""))
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "Dane"
        });
        expect(users.length).toBe(0);
      });
    });

    describe("password and confirmPassword do not match:", () => {
      it("throw error", async () => {
        await expect(
          client.mutate({
            mutation: gql(
              signupUserMutation(
                "Dane",
                "dane@dane.com",
                "passwordOne",
                "differentPassword"
              )
            )
          })
        ).rejects.toThrowError();
      });

      it("not signup user", async () => {
        const users = await User.find({
          username: "Dane"
        });
        expect(users.length).toBe(0);
      });
    });
  });
});
