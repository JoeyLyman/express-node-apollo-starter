const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server-express");

const auth = require("@util/auth");
const dbUtil = require("../../util/mongo");
const db = require("./mongo");
const validate = require("./validate");

async function login(usernameOrEmail, password) {
  // Validate user input
  const { valid, errors } = validate.loginInput(usernameOrEmail, password);
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }

  // Determine if usernameOrEmail is username or email and then retrieve user from db accordingly
  let response = {};
  if (usernameOrEmail.includes("@")) {
    response = await dbUtil.findUserbyEmail(usernameOrEmail, true);
  } else {
    response = await dbUtil.findUserbyUsername(usernameOrEmail, true);
  }

  // Throw error if user was not found in db
  if (!response) {
    errors.general = "User not found";
    throw new UserInputError("User not found", { errors });
  }

  // Confirm password
  const match = await bcrypt.compare(password, response.password);
  if (!match) {
    errors.general = "Wrong credentials";
    throw new UserInputError("Wrong credentials", { errors });
  }

  // Update user.lastLogin
  const newLastLoginDate = new Date();
  db.updateLastLogin(response._id, newLastLoginDate);

  // if (!response.username) {
  //   return {
  //     code: 500,
  //     success: false,
  //     message: `Error, User not found.`,
  //     user: null,
  //     token: null
  //   };
  // }

  return {
    code: 200,
    success: true,
    message: `User ${response.username} successfully logged in!`,
    user: { ...response, lastLogin: newLastLoginDate },
    token: auth.app.generateToken(response),
  };
}

module.exports = { login };
