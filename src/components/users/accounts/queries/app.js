const { checkAuth } = require("../../../../util/auth/app");
const db = require("./mongo");

async function getMyProfile(context) {
  // Get userId from context
  const user = checkAuth(context);

  const res = await db.getMyProfile(user);
  if (!res) {
    return {
      code: 999,
      success: false,
      message: "Profile not successfully returned.  No response from DB",
      user: null,
    };
  }
  return {
    code: 200,
    success: true,
    message: "Profile successfully returned.",
    user: res,
    relation: "MYSELF",
  };
}

async function getMyFriends(context) {
  // Get userId from context
  const user = checkAuth(context);

  const res = await db.getMyFriends(user);
  //console.log(`friends:`, res);

  return res;
}

async function getMyBuddiesIDs(myID) {
  // Get userId from context
  //const user = checkAuth(context);

  const res = await db.getMyBuddiesIDs(myID);
  //console.log(`friends:`, res);

  return res;
}

async function getUserByID(userID) {
  return await db.getUserByID(userID);
}

async function getUserProfile(context, input) {
  // Get userId from context
  const user = checkAuth(context);

  const res = await db.getUserProfile(user._id, input.username);

  if (!res) {
    return {
      code: 999,
      success: false,
      message: "Profile not successfully returned.  No response from DB",
      user: null,
    };
  }
  return {
    code: 200,
    success: true,
    message: "Profile successfully returned.",
    user: res,
    relation: null, //res.relation,
  };
}

async function searchUsers(context, input) {
  const user = checkAuth(context);

  // We want to return friends first? Then new people

  const res = await db.searchUsers(user._id, input);
  return res;
}

module.exports = {
  getMyProfile,
  getMyFriends,
  getMyBuddiesIDs,
  getUserByID,
  getUserProfile,
  searchUsers,
};
