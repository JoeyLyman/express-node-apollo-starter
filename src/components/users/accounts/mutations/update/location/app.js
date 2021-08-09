// const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
// const validate = require("../../util/validate");

async function updateProfileLocation(input, context) {
  const user = auth.app.checkAuth(context);

  // Validate text input
  // const { valid, errors } = validate.contactInfo(email, phoneNumber);
  // if (!valid) {
  //   throw new UserInputError("Errors", { errors });
  // }

  const response = await db.updateProfileLocation(input, user._id);
  if (!response.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User location not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `User ${response.value.username} location successfully updated!`,
    user: response.value,
  };
}

module.exports = {
  updateProfileLocation,
};
