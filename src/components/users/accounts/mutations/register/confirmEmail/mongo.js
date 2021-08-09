// async function confirmEmail(context, token) {
// // Find by user, if correct user,
// }

// async function resendConfirmationEmail() {}

const { ConfirmEmailToken } = require("./model");
const { User } = require("../../../../model");

async function getConfirmEmailToken(token) {
  const res = await ConfirmEmailToken.findOne({ token });
  return res;
}

async function createNewConfirmEmailToken(username, email, token) {
  return await ConfirmEmailToken.findOneAndUpdate(
    { username },
    { $set: { username, email, token } },
    { upsert: true, new: true, rawResult: true, runValidators: true }
  );
}

// async function recreateConfirmEmailToken(username, email, token) {
//   let query = { username, email };

//   return await ConfirmEmailToken.findOneAndUpdate(
//     query,
//     { $set: { username, email, token } },
//     { upsert: true, new: true, rawResult: true, runValidators: true }
//   );
// }

async function setEmailToConfirmed(userID) {
  const res = await User.findOneAndUpdate(
    { _id: userID },
    { $set: { "email.confirmed": true } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
  return res;
}

async function updateEmailToNewAddress(userID) {
  const user = await User.findOne({ _id: userID });
  return await User.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        email: {
          address: user.email.newAddress,
          confirmed: true,
          newAddress: null,
        },
      },
    },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

async function deleteTokensForConfirmedEmail(email) {
  // TODO: delete all tokens for an email that was confirmed
  return await ConfirmEmailToken.deleteMany({ email });
}

module.exports = {
  getConfirmEmailToken,
  createNewConfirmEmailToken,
  setEmailToConfirmed,
  updateEmailToNewAddress,
  deleteTokensForConfirmedEmail,
};
