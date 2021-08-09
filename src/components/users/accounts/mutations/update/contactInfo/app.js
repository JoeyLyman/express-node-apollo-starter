const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
const validate = require("../../../util/validate");

async function updateContactInfo(context, email, phoneNumber) {
  const user = auth.app.checkAuth(context);

  // Validate text input
  const { valid, errors } = validate.contactInfo(email, phoneNumber);
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }
  const response = await db.updateContactInfo(user._id, email, phoneNumber);

  if (!res.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `User ${response.username} successfully updated!`,
    user: response,
  };
}

module.exports = {
  updateContactInfo,
};
