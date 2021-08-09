// const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
// const validate = require("../../util/validate");

async function updateProfileName(input, context) {
  const user = auth.app.checkAuth(context);

  // Validate text input
  // const { valid, errors } = validate.contactInfo(email, phoneNumber);
  // if (!valid) {
  //   throw new UserInputError("Errors", { errors });
  // }

  const response = await db.updateProfileName(input, user._id);

  if (!response.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User Name not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `User ${response.value.username} Name successfully updated!`,
    user: response.value,
  };
}

module.exports = {
  updateProfileName,
};
