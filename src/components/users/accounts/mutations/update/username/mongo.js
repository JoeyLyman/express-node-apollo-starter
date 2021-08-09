const { User } = require("../../../../model");

async function updateProfileUsername(input, userID) {
  const { username } = input;
  const lowercaseUsername = username.toLowerCase();

  return await User.findOneAndUpdate(
    { _id: userID },
    { $set: { username: lowercaseUsername } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

module.exports = {
  updateProfileUsername,
};
