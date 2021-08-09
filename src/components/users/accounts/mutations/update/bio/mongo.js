const { User } = require("../../../../model");

async function updateProfileBio(input, userID) {
  const { bio } = input;
  return await User.findOneAndUpdate(
    { _id: userID },
    { $set: { bio } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

module.exports = {
  updateProfileBio,
};
