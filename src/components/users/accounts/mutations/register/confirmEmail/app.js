const nanoid = require("nanoid");
const { UserInputError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");

const nodemailerServ = require("@services/email/nodemailer");
const auth = require("@util/auth/");
const db = require("./mongo");
const dbUtil = require("../../../util/mongo");
const dbLogin = require("../../login/mongo");
const { buildConfirmEmailHtml } = require("./templates/confirmEmailTemplate");

// For Signup
async function createConfirmEmailToken(username, email) {
  const token = username + nanoid(20);
  const res = await db.createNewConfirmEmailToken(username, email, token);
  return res;
}

// Called during signup
async function sendConfirmEmailEmail(username, email, token) {
  const url = `${process.env.DOMAIN}/confirmEmail/${token}`;
  const subject = `Aloha, ${username}. Click link to confirm Yewtide account.`;
  const html = await buildConfirmEmailHtml(username, url);

  // TODO: make sure email is sent
  const res = await nodemailerServ.app.sendEmail(email, subject, html);
  return res;
}

// Called via client if user has issue
async function resendConfirmEmailEmail(email) {
  // TODO: change this to automatically fire, if the person tries to log in (and password matches) but their email isnt confirmed yet?
  // find user account that is not confirmed with this username
  const user = await dbUtil.findUserbyEmail(email);

  // throw error if user does not exist
  if (!user) {
    return {
      success: false,
      message:
        "No matching email in database. Please try again or create another account.",
      code: 400,
      email,
    };
    // errors.email =
    //   "No matching email in database. Please try again or create another account.";
    // throw new UserInputError(
    //   "No matching email in database.  Please try again or create another account.",
    //   { errors }
    // );
  }

  // throw error is user is confirmed already "User already confirmed"
  if (user.email.confirmed == true) {
    return {
      success: false,
      message: "Email is already confirmed.",
      code: 400,
      email,
    };
    // errors.username = "Email is already confirmed.";
    // throw new UserInputError("Email is already confirmed.", { errors });
  }

  // Generate & Replace old token
  const resFromCreateToken = await db.createNewConfirmEmailToken(
    user.username,
    user.email.address
  );

  // Send email
  const sendEmailRes = await sendConfirmEmailEmail(
    user.username,
    user.email.address,
    resFromCreateToken.value.token
  );

  console.log(`send email res:`, sendEmailRes);
  return {
    code: 200,
    success: true,
    message: `Email resent for ${email}`,
    email,
  };
}

// Called after form is submitted
async function confirmEmail(token) {
  const errors = {};

  // OPP: can i combine token db call and user db call into an aggregation pipeline?
  // Get userId from token
  const resFromGetToken = await db.getConfirmEmailToken(token);
  // Throw error if no matching token
  if (!resFromGetToken) {
    return {
      success: false,
      message: "No matching token in database.",
      code: 400,
      user: null,
      token: null,
    };
  }

  // Get User from Token in DB
  const resFromGetUser = await dbUtil.findUserbyUsername(
    resFromGetToken.username
  );

  // Throw error if user does not exist
  if (!resFromGetUser) {
    return {
      success: false,
      message: "No matching user in database.",
      code: 400,
      user: null,
      token: null,
    };
  }

  let userObject;
  // If user is already confirmed
  if (resFromGetUser.email.confirmed === true) {
    // Either: it is an email update
    if (resFromGetUser.email.newAddress) {
      // Update user
      const { lastErrorObject, value } = await db.updateEmailToNewAddress(
        resFromGetUser._id
      );

      // Grab user object to be returned via gql
      userObject = value;

      //If setEmailToConfirmed did not update an existing user, throw an error
      if (!lastErrorObject.updatedExisting) {
        return {
          success: false,
          message: "Error, email not updated to to address.",
          code: 500,
          user: null,
          token: null,
        };
      }
    } else {
      // Email is already set to confirmed, and no newAddress (i.e. it is not being updated)
      // Or email is already confirmed for signup
      return {
        success: false,
        message: "Email is already confirmed",
        code: 400,
        user: null,
        token: null,
      };
    }
  } else {
    // Set email to confirmed for initial signup email confirmation
    const { lastErrorObject, value } = await db.setEmailToConfirmed(
      resFromGetUser._id
    );

    userObject = value;
    //If setEmailToConfirmed did not update an existing user, throw an error
    if (!lastErrorObject.updatedExisting) {
      return {
        success: false,
        message: "Error, email not updated to confirmed.",
        code: 500,
        user: null,
        token: null,
      };
    }
  }

  //  Delete confirmEmailtoken objects for all of the newly confirmed email
  await db.deleteTokensForConfirmedEmail(userObject.email.address);

  // Update last login
  const newLastLoginDate = new Date();
  await dbLogin.updateLastLogin(userObject, newLastLoginDate);

  console.log(`userObject:`, userObject);
  console.log(`object:`, { ...userObject, lastLogin: newLastLoginDate });
  // TODO: if res doesnt delete anything... log it?
  return {
    code: 200,
    success: true,
    message: `User ${userObject.username} successfully confirmed and logged in!`,
    user: { ...userObject.toObject(), lastLogin: newLastLoginDate },
    token: auth.app.generateToken(userObject),
  };
}

async function receivedEmailByMistake(token) {
  // TODO: handle this error ; delete token and user, and maybe log this try to figure out perpetrator?
}

module.exports = {
  createConfirmEmailToken,
  sendConfirmEmailEmail,
  confirmEmail,
  resendConfirmEmailEmail,
  receivedEmailByMistake,
};
