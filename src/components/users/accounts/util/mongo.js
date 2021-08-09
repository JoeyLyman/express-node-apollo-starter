const { User } = require("../../model");

// for Login
async function findUserbyUsername(username, confirmed) {
  const query = { username };

  if (confirmed == true) {
    query["email.confirmed"] = true;
  }
  if (confirmed == false) {
    query["email.confirmed"] = false;
  }

  return await User.findOne(query).lean();
}

async function findUserbyEmail(email) {
  return await User.findOne({ "email.address": email }).lean();
}

module.exports = {
  findUserbyUsername,
  findUserbyEmail,
};
