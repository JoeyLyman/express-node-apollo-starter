const { User } = require("../../../../model");

async function updateProfilePictureUrl(input, userID) {
  const { url, publicID } = input;
  const res = await User.findOneAndUpdate(
    { _id: userID },
    { $set: { profilePicture: { url, publicID } } },
    { upsert: false, new: false, rawResult: true, runValidators: true }
  );

  console.log(`res in mongo:`, res);

  return res;
}

module.exports = {
  updateProfilePictureUrl,
};
