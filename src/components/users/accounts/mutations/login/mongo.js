const { User } = require("../../../model");

async function updateLastLogin(userID, date) {
  const res = await User.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        lastLogin: date,
      },
    },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );

  return res;
}

module.exports = { updateLastLogin };
