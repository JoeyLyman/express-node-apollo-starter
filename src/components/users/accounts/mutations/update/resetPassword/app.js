const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const { UserInputError } = require("apollo-server-express");
const nodemailerServ = require("@services/email/nodemailer");
const { generateToken } = require("@util/auth/app");
const { updateLastLogin } = require("../../login/mongo");
//const confirmEmail = require("../../register/confirmEmail");
const db = require("./mongo");
const dbUtil = require("../../../util/mongo");
const appConfirmEmail = require("../../register/confirmEmail/app");
const {
  buildResetPasswordEmailHtml,
} = require("./templates/resetPasswordEmailTemplate");

async function sendResetPasswordEmail(email) {
  // Find user in DB
  const user = await dbUtil.findUserbyEmail(email);

  console.log(`user:`, user);
  // If User not found, throw error
  if (!user) {
    //errors.general = "Account not found";
    //throw new UserInputError("Account not found", { errors });
    return {
      code: 500,
      success: false,
      message: `Account not found.`,
      email,
    };
  }

  // If email isn't confirmed yet, resend confirm email email
  if (!user.email.confirmed) {
    const resFromResendingConfirmEmailEmail =
      await appConfirmEmail.resendConfirmEmailEmail(email);
    console.log(
      `resFromResendingConfirmEmailEmail:`,
      resFromResendingConfirmEmailEmail
    );
    return {
      code: 400,
      success: false,
      message: `Email not yet confirmed.  Check email for confirmation link.`,
      email,
    };
  }

  // Generate secret token with userID in it
  const urlToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
      lastLogin: user.lastLogin,
      password: user.password,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
  console.log(`url token:`, urlToken);

  // and Send Email with that token in a URL link

  // Called during signup
  const url = `${process.env.DOMAIN}/resetPassword/${urlToken}`;
  const subject = `Aloha. Reset Yewtide password link.`;
  const html = await buildResetPasswordEmailHtml(url);

  // TODO: make sure email is sent

  const res = await nodemailerServ.app.sendEmail(
    "joeylyman@outlook.com",
    subject,
    html
  );
  if (res) {
    return {
      code: 200,
      success: true,
      message: `Email has been sent to ${email} to reset password.`,
      email,
    };
  }

  // Tell client success, email was sent
}

async function resetPassword(token, newPassword) {
  // decode token for userID
  const userFromToken = jwt.verify(token, process.env.SECRET_KEY);
  console.log(`user from decoded token:`, userFromToken);

  // Find by email (so if email has changed, will not find user)
  const userFromDb = await dbUtil.findUserbyEmail(userFromToken.email.address);
  console.log(`user from db:`, userFromDb);

  if (!userFromDb || !userFromToken) {
    return {
      code: 500,
      success: false,
      message: `Invalid token. User not found.`,
      user: null,
      token: null,
    };
  }

  // Deprecated? if it is same password, i think that is OK?
  // Make sure password isn't same as current password.
  // const match = await bcrypt.compare(newPassword, userFromDb.password);
  // // console.log(`userFromDbPassword:`, userFromDb.password);
  // // console.log(`newPassword:`, newPassword);
  // // console.log(`match:`, match);
  // if (match) {
  //   return {
  //     code: 500,
  //     success: false,
  //     message: `Reset password link is expired.`,
  //     user: null,
  //     token: null,
  //   };
  // }

  // Make sure password hash in token is the same as password hash in DB
  //  this will ensure that it is a current token, and will fail if DB pw
  //  has been updated since the token was created.
  if (userFromToken.password !== userFromDb.password) {
    return {
      code: 500,
      success: false,
      message: `Password has already been reset.  Reset password link is expired.`,
      user: null,
      token: null,
    };
  }

  if (
    userFromDb.username !== userFromToken.username ||
    userFromDb._id.toString() !== userFromToken._id
  ) {
    return {
      code: 500,
      success: false,
      message: `Password not reset; email or username may have changed.`,
      user: null,
      token: null,
    };
  }

  // If user has logged in since email was sent, throw error
  if (userFromDb.lastLogin.valueOf() > userFromToken.lastLogin.valueOf()) {
    return {
      code: 500,
      success: false,
      message: `User has logged in since reset password email was sent.`,
      user: null,
      token: null,
    };
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 12);

  const resFromResetPassword = await db.resetPassword(
    userFromDb._id,
    newHashedPassword
  );

  // Update user.lastLogin
  const newDateForLastLogin = new Date();
  updateLastLogin(userFromDb._id, newDateForLastLogin);

  //const token = generateToken();
  console.log(`res from reset password:`, resFromResetPassword.value);
  return {
    code: 200,
    success: true,
    message: `User ${resFromResetPassword.value.username} successfully reset password!`,
    user: {
      ...resFromResetPassword.value.toObject(),
      lastLogin: newDateForLastLogin,
    },
    token: generateToken(userFromDb),
  };
}

module.exports = { sendResetPasswordEmail, resetPassword };
