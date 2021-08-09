// const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const db = require("./mongo");
// const validate = require("../../util/validate");

async function updateProfileUsername(input, context) {
  const user = auth.app.checkAuth(context);
  // Username is "unique" in schema, so should not have to check it?
  const response = await db.updateProfileUsername(input, user._id);

  console.log(`response:`, response);
  if (!response.lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User Username not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `User ${response.value.username} Username successfully updated!`,
    user: response.value,
  };
}

module.exports = {
  updateProfileUsername,
};
