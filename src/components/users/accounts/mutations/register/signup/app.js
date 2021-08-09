const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server-express");

const confirmEmail = require("../confirmEmail");
// const auth = require("@util/auth");
const db = require("./mongo");
const validate = require("./validate");

// signup code stuff
const appSignupCode = require("./signupCode/app");

// function handleErr(err) {
//   return {
//     code: 500,
//     success: false,
//     message: `Message: ${err}`,
//     user: null,
//     token: null
//   };
// }

async function signup(
  username,
  email,
  phoneNumber,
  password,
  confirmPassword,
  signupCode
) {
  // Validate text input
  const { valid, errors } = validate.registerInput(
    username,
    email,
    password,
    confirmPassword
  );
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }

  // Validate signup code
  const validSignupCode = await appSignupCode.checkSignupCode(signupCode);
  if (!validSignupCode) {
    errors.signupCode = "Invalid signup code.";
    throw new UserInputError("Errors", { errors });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Lowercase username
  const lowercaseUsername = username.toLowerCase();

  // Save new user to db, save token object, and return info on existing username and userData
  const { lastErrorObject, value: userData } = await db.signupNewUser(
    lowercaseUsername,
    email,
    phoneNumber,
    hashedPassword
  );

  // Remove password and __v from returned user object
  const {
    __V,
    password: savedPassword,
    ...newUserResponseObject
  } = userData.toObject();

  // If username or email is already taken, throw UserInputError
  if (lastErrorObject.updatedExisting) {
    if (username == userData.username) {
      errors.username = "Username already taken.";
      throw new UserInputError("Errors", { errors });
    }
    if (email == userData.email.address) {
      errors.email = "Email already taken.";
      throw new UserInputError("Errors", { errors });
    }
  }

  if (!newUserResponseObject.username) {
    return {
      code: 500,
      success: false,
      message: `Error, User not created.`,
      user: null,
    };
  }

  // Generate and save ConfirmEmailToken object
  const createConfirmEmailTokenRes =
    await confirmEmail.app.createConfirmEmailToken(username, email);

  if (createConfirmEmailTokenRes.lastErrorObject.n == 0) {
    return {
      code: 500,
      success: false,
      message: `Error, confirmEmailToken not created.`,
      user: null,
    };
  }

  //console.log(`token"`, createConfirmEmailTokenRes.value.token);
  // Send confirmation email
  // TODO:
  confirmEmail.app.sendConfirmEmailEmail(
    username,
    newUserResponseObject.email.address,
    createConfirmEmailTokenRes.value.token
  );

  // Mutate the signupCode to "used" and "accountID"
  appSignupCode.updateSignupCodeAfterUse(signupCode, newUserResponseObject._id);

  return {
    code: 200,
    success: true,
    message: `User ${newUserResponseObject.username} successfully created!`,
    user: { ...newUserResponseObject },
  };
}

module.exports = { signup };
