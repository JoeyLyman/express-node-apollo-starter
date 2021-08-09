// throw error if resendEmail request has invalid (or expired), username or email
//

// dont create two tokens for same username + email, replace the first one on resendConfirmEmailToken
// for diffferent usernames, same email
// - two tokens
// - if first one confirms, throw error if second one tries to confirm
// -

// - can create token if user creates account, confirms account, deletes account, creates another account

// - signup user
// - check that email is sent
// - token is created

// LATER:
// [ - go to mockUrl ]
// [ - check that url is entered into gql confirmEmail ]

// - click resendEmail (for username)
// -> check that new token is created to REPLACE old token for that username + email combo
// -> username don't find a token -> throw error

// - confirm email form works and
// - pulls token from url
// - form submit
//   - sets email to confirmed
//   - deletes token
//   - responds with userAuthMutation response / user gets token / gets logged invalid
//   -- edge cases:
//     - someone else tries to confirmEmail when email is confirmed with another account -> throw error and make sure they dont get confirmed
//     ->

const { gql } = require("apollo-server-express");

const { client } = require("../../../../../../../test/apolloClient");
const mongooseService = require("../../../../../../../test/mongoose");
const { User } = require("../../../../model");
const {
  signupUserMutation,
  confirmEmailMutation,
} = require("../../../test/mutations");
const confirmEmail = require("../confirmEmail");

// TODO: Test for bad phone numbers
// TODO: ensure signup doesnt go through, when errors are thrown (cuz errors are thrown after we talk to DB)
// TODO: also, for each signup test, do User.find and do 2 expects and have it be the right model that comes back, the right quantity of documents, etc

// Tests
describe("Testing the users.accounts.confirmEmail mutation to:", () => {
  // Setup
  beforeAll(async () => {
    await mongooseService.connect();
    await User.deleteMany();
    await confirmEmail.model.ConfirmEmailToken.deleteMany();

    // Create an idle, non-confirmed user with same email as Sydney
    await client.mutate({
      mutation: gql(
        signupUserMutation(
          "Joey",
          "sydney@sydney.com",
          "joeyrocks",
          "joeyrocks"
        )
      ),
    });
  });

  afterAll(async () => {
    // await User.deleteMany();
    // await confirmEmail.model.ConfirmEmailToken.deleteMany();
    await mongooseService.disconnect();
  });

  // Send Email
  // TODO: make sure email is sent

  // Resend Email
  // TODO: make sure email is sent, sent to correct email, and only if email isnt confirmed yet

  // Received email by mistake
  // TODO:

  // Confirm Email Flow edge cases
  describe("confirmEmail edge cases:", () => {
    describe("on user signup:", () => {
      it("successfully creates confirmEmailToken on user signup", async () => {
        expect.assertions(3);

        // Signup user Sydney
        await client.mutate({
          mutation: gql(
            signupUserMutation(
              "Sydney",
              "sydney@sydney.com",
              "sydneyrocks",
              "sydneyrocks"
            )
          ),
        });

        // Find token
        const tokens = await confirmEmail.model.ConfirmEmailToken.find({
          username: "Sydney",
        });

        // Check that one token was made
        expect(tokens.length).toBe(1);

        // Check that it is for Sydney
        expect(tokens[0].username).toBe("Sydney");
        expect(tokens[0].email).toBe("sydney@sydney.com");
      });
      // it("successfully sends email with correct token in link url", async () => {
      //   // TODO:
      // })
    });

    describe("password does not match on confirmEmailInput:", () => {
      it("throw error", async () => {
        const tokenObject = await confirmEmail.model.ConfirmEmailToken.findOne({
          username: "Sydney",
        });
        await expect(
          client.mutate({
            mutation: gql(
              confirmEmailMutation("sydneyROCKS", tokenObject.token)
            ),
          })
        ).rejects.toThrowError();
      });
      it("does not confirm email", async () => {
        const userObject = await User.findOne({ username: "Sydney" });
        expect(userObject.email.confirmed).toBe(false);
      });
    });

    describe("successfully confirm email:", () => {
      it("sets email to confirmed", async () => {
        // Get token
        const tokenObject = await confirmEmail.model.ConfirmEmailToken.findOne({
          username: "Sydney",
        });

        // Confirm email GQL for Sydney
        const res = await client.mutate({
          mutation: gql(confirmEmailMutation("sydneyrocks", tokenObject.token)),
        });

        // Expect response to show user confirmed
        expect(res.data.confirmEmail.user.email.confirmed).toBe(true);

        // Find user and expect email to be confirmed
        const userObject = await User.findOne({ username: "Sydney" });
        expect(userObject.email.confirmed).toBe(true);
      });
      it("deletes tokens in database", async () => {
        const tokenObjects = await confirmEmail.model.ConfirmEmailToken.find({
          email: "sydney@sydney.com",
        });
        expect(tokenObjects.length).toBe(0);
      });
    });

    // describe("email is already confirmed with this account:", () => {
    //   it("throw error", async () => {
    //     await expect(
    //       client.mutate({
    //         mutation: gql(
    //           confirmEmailMutation("sydneyrocks", tokenObject.token)
    //         )
    //       })
    //     ).rejects.toThrowError();
    //     // Try to confirm email again with Sydney
    //   });
    // });

    // describe("email is already confirmed with another account:", () => {
    //   it("throw error", async () => {
    //     expect.assertions(2);
    //     // Get token
    //     const tokenObject = await confirmEmail.model.ConfirmEmailToken.findOne({
    //       username: "Joey"
    //     });
    //     // Ensure we got token
    //     expect(tokenObject.username).toBe("Joey");

    //     // Attempt to confirmEmail
    //     await expect(
    //       client.mutate({
    //         mutation: gql(
    //           confirmEmailMutation("sydneyROCKS", tokenObject.token)
    //         )
    //       })
    //     ).rejects.toThrowError();
    //   });
    //   it("does not confirm email", async () => {
    //     // Find user and expect email to not be confirmed
    //     const userObject = await User.findOne({ username: "Joey" });
    //     expect(userObject.email.confirmed).toBe(false);
    //   });
    // });

    describe("username from token does not exist in user collection:", () => {
      it("throw error", async () => {
        expect.assertions(2);
        // Create token in db
        const res = await confirmEmail.model.ConfirmEmailToken.create({
          username: "noone",
          email: "no@no.com",
          token: "what?",
        });
        expect(res.username).toBe("noone");

        // try to confirm email
        await expect(
          client.mutate({
            mutation: gql(confirmEmailMutation("sydneyROCKS", res.token)),
          })
        ).rejects.toThrowError();
      });
    });

    describe("confirmEmail token does not exist:", () => {
      it("throw error", async () => {
        // Attempt to confirmEmail
        await expect(
          client.mutate({
            mutation: gql(
              confirmEmailMutation("sydneyrocks", "this Is a weird tokeN")
            ),
          })
        ).rejects.toThrowError();
      });
    });
  });
});
