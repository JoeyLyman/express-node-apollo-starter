const { User } = require("../../../../model");

async function resetPassword(userID, newPassword) {
  const res = await User.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        password: newPassword,
      },
    },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );

  return res;
  // return res;
}

module.exports = { resetPassword };
