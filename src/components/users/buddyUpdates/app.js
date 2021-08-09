const { checkAuth } = require("../../../util//auth/app");
const db = require("./mongo");

async function offerBuddy(input, context) {
  const user = checkAuth(context);

  const response = await db.offerBuddy(input, user._id);

  if (!response) {
    return {
      code: 500,
      success: false,
      message: `Error, no response from DB.`,
      user: null,
      buddy: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Buddy Offer Successful`,
    user: response,
    buddy: null,
  };
}

async function removeBuddy(input, context) {
  const user = checkAuth(context);

  const response = await db.removeBuddy(input, user._id);

  if (!response) {
    return {
      code: 500,
      success: false,
      message: `Error, no response from DB.`,
      user: null,
      buddy: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Buddy Removal Successful`,
    user: response.user,
    buddy: response.buddy,
  };
}

async function acceptBuddyOffer(input, context) {
  const user = checkAuth(context);

  const response = await db.acceptBuddyOffer(input, user._id);

  if (!response) {
    return {
      code: 500,
      success: false,
      message: `Error, no response from DB.`,
      user: null,
      buddy: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Accept Buddy Offer Successful`,
    user: response,
    buddy: null,
  };
}

async function denyBuddyOffer(input, context) {
  const user = checkAuth(context);

  const response = await db.denyBuddyOffer(input, user._id);

  if (!response) {
    return {
      code: 500,
      success: false,
      message: `Error, no response from DB.`,
      user: null,
      buddy: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Deny Buddy Offer Successful`,
    user: null,
    buddy: response,
  };
}

async function cancelBuddyOffer(input, context) {
  const user = checkAuth(context);

  const response = await db.cancelBuddyOffer(input, user._id);

  if (!response) {
    return {
      code: 500,
      success: false,
      message: `Error, no response from DB.`,
      user: null,
      buddy: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `Cancel Buddy Offer Successful`,
    user: response,
    buddy: null,
  };
}

module.exports = {
  offerBuddy,
  removeBuddy,
  acceptBuddyOffer,
  denyBuddyOffer,
  cancelBuddyOffer,
};

//async function removeFriend(friendId, context) {
//   // Validate?
//   const user = checkAuth(context);

//   const response = await db.removeFriend(friendId, user._id);
// }

// async function getFriends(context) {
//   // Validate?
//   const user = checkAuth(context);

//   const response = await db.getFriends(user._id);
//   // TODO: test this, and also have response for "no one is following you yet"
//   if (!response) {
//     return {
//       code: 500,
//       success: false,
//       message: `Error, could not friends.`,
//       user: null
//     };
//   }

//   return {
//     code: 200,
//     success: true,
//     message: `User ${userObject.username} successfully logged in!`,
//     user: { ...userObject }
//   };
// }
