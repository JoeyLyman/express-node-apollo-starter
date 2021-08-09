const { User } = require("../../../../model");

async function changePassword(userId, password) {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { password } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  ).lean();
}

module.exports = {
  changePassword,
};
