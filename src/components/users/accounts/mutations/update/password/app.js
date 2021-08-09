const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
const validate = require("../../../util/validate");

async function changePassword(context, newPassword, newConfirmPassword) {
  const user = auth.app.checkAuth(context);

  // Validate text input
  const { valid, errors } = validate.password(newPassword, newConfirmPassword);
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }

  // Hash newPassword
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const response = await db.changePassword(user._id, hashedPassword);
  if (!response.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, password not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Password successfully updated!`,
    user: response.value,
  };
}

module.exports = {
  changePassword,
};
