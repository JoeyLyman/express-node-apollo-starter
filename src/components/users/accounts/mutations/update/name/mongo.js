const { User } = require("../../../../model");

async function updateProfileName(input, userID) {
  const { name } = input;
  return await User.findOneAndUpdate(
    { _id: userID },
    { $set: { name } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

module.exports = {
  updateProfileName,
};
