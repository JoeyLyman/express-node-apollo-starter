const { User } = require("../../../../model");

async function updateContactInfo(userId, email, phoneNumber) {
  const update = {};
  if (email) {
    update.email = email;
  }
  if (phoneNumber) {
    update.phoneNumber = phoneNumber;
  }
  return await User.findOneAndUpdate(
    { _id: userId },
    { $set: update },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

module.exports = {
  updateContactInfo,
};
