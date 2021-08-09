const { User } = require("../../../../model");

async function signupNewUser(username, email, phoneNumber, password) {
  // Find all usernames with this email that are unconfirmed, and delete them

  await User.deleteMany({ "email.address": email, "email.confirmed": false });
  // Create save user promise, while ensuring username nor the same email (if confirmed) is taken
  const query = {
    $or: [
      { username, isDeleted: false },
      { "email.address": email, "email.confirmed": true, isDeleted: false },
    ],
  };

  const res = await User.findOneAndUpdate(
    query,
    {
      $setOnInsert: {
        username,
        email: { address: email, confirmed: false },
        phoneNumber,
        password,
        friendsIDs: [],
        isDeleted: false,
      },
    },
    { upsert: true, new: true, rawResult: true, runValidators: true }
  );

  return res;
}

// async function deleteUnconfirmedUsers(email) {
//   // TODO: when a user is confirmed, delete all other users that had the same email
//   return await User.deleteMany({
//     "email.address": email,
//     "email.confirmed": false,
//   });
// }

module.exports = { signupNewUser };
