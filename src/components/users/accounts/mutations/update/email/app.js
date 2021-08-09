// const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
// const validate = require("../../util/validate");
const confirmEmailApp = require("../../register/confirmEmail/app");

async function updateEmail(input, context) {
  const { emailAddress } = input;
  const user = auth.app.checkAuth(context);

  // TODO: validate?

  // make sure email isn't already taken
  const emailAlreadyTaken = await db.isEmailAlreadyTaken(emailAddress);
  if (emailAlreadyTaken) {
    return {
      code: 500,
      success: false,
      message: `Error, email already taken.`,
      user: null,
    };
  }

  // Generate and save ConfirmEmailToken object
  const createConfirmEmailTokenRes = await confirmEmailApp.createConfirmEmailToken(
    user.username,
    emailAddress
  );

  console.log("createConfirmEmailTokenRes:", createConfirmEmailTokenRes);

  if (createConfirmEmailTokenRes.lastErrorObject.n == 0) {
    return {
      code: 500,
      success: false,
      message: `Error, confirmEmailToken not created.`,
      user: null,
    };
  }

  const response = await db.addNewEmailAddress(input, user._id);

  console.log(`response:`, response);
  if (!response.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User email not updated.`,
      user: null,
    };
  }

  console.log(`token"`, createConfirmEmailTokenRes.value.token);
  // Send confirmation email
  // TODO:
  const res = await confirmEmailApp.sendConfirmEmailEmail(
    user.username,
    response.value.email.newAddress,
    createConfirmEmailTokenRes.value.token
  );

  console.log(`res from sending email:`, res);

  return {
    code: 200,
    success: true,
    message: `User ${response.value.username} confirm email sent!`,
    user: response.value,
  };
}

module.exports = {
  updateEmail,
};
