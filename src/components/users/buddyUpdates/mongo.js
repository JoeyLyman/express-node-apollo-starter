const { User } = require("../model");

async function offerBuddy({ buddyID }, userID) {
  // add buddyID to userID's friendsIDs
  return await User.findOneAndUpdate(
    { _id: userID },
    { $addToSet: { friendsIDs: buddyID } },
    { new: true },

    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );
}

async function removeBuddy({ buddyID }, userID) {
  // remove from both users friendsIDs
  const resMine = await User.findOneAndUpdate(
    { _id: userID },
    { $pull: { friendsIDs: buddyID } },
    { new: true },
    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );

  const resBuddy = await User.findOneAndUpdate(
    { _id: buddyID },
    { $pull: { friendsIDs: userID } },
    { new: true },

    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );

  return {
    user: resMine,
    buddy: resBuddy,
  };
}

async function acceptBuddyOffer({ buddyID }, userID) {
  // maybe? confirm that buddyID has me on their friendsIDs
  // add buddyID to userID's friendsIDs

  return await User.findOneAndUpdate(
    { _id: userID },
    { $addToSet: { friendsIDs: buddyID } },
    { new: true },

    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );
}

async function denyBuddyOffer({ buddyID }, userID) {
  // remove userID from buddyID's friendsIDs
  return await User.findOneAndUpdate(
    { _id: buddyID },
    { $pull: { friendsIDs: userID } },
    { new: true },

    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );
}

async function cancelBuddyOffer({ buddyID }, userID) {
  // remove buddyID from userID's friendsIDs

  return await User.findOneAndUpdate(
    { _id: userID },
    { $pull: { friendsIDs: buddyID } },
    { new: true },

    function (err, res) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return res;
      }
    }
  );
}

// async function getFriends(userId) {
//   return await User.findById(userId, function(err, res) {
//     if (err) {
//       console.log(`Returned ${err} while attempting to find friends.`);
//       return err;
//     }
//     return res;
//   })
//     .populate("friends")
//     .lean();
// }

module.exports = {
  offerBuddy,
  removeBuddy,
  acceptBuddyOffer,
  denyBuddyOffer,
  cancelBuddyOffer,
};
