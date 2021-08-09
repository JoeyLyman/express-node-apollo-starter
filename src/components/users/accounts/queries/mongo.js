const { Types } = require("mongoose");
const { User } = require("../../model");

async function getMyProfile(user) {
  const res = await User.findById(user._id);

  return res;
}

async function getMyFriends(user) {
  const friends = await User.aggregate([
    // Find myself
    {
      $match: {
        _id: Types.ObjectId(user._id),
      },
    },
    // Only myself, don't keep looking, i think this optimizes the pipeline
    { $limit: 1 },
    // Create field "friends" on my user document, that has the full user object of each of my friends
    {
      $lookup: {
        from: "users",
        let: { myID: "$_id", friendsIDs: "$friendsIDs" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // my friends are the ones who are on my friendsIDs list, and where i am ALSO on their friendsIDs list
                  { $in: ["$_id", "$$friendsIDs"] },
                  { $in: ["$$myID", { $ifNull: ["$friendsIDs", []] }] },
                ],
              },
            },
          },
        ],
        as: "friends",
      },
    },
    // Project so that I do not return all my profile info, only the new "friends" field; id: 0 also removes my _id from each of my friends documents
    {
      $project: {
        friends: 1,
        _id: 0,
      },
    },
    // create an individual document for each of my friends; i.e. split the "friends" array into documents where "friends" is root of each one and document is the friend
    { $unwind: "$friends" },
    // remove the "friends" root on each document, so that we just have individual documents that are my friends. yew!
    {
      $replaceRoot: {
        newRoot: "$friends",
      },
    },
  ]);

  return friends;
  //const meWithFriends = await User.findById(user._id).populate("friendsIDs");
  //return meWithFriends.friendsIDs;
}

async function getMyBuddiesIDs(userID) {
  const friends = await User.aggregate([
    // Find myself
    {
      $match: {
        _id: Types.ObjectId(userID),
      },
    },
    // Only myself, don't keep looking, i think this optimizes the pipeline
    { $limit: 1 },
    // Create field "friends" on my user document, that has the full user object of each of my friends
    {
      $lookup: {
        from: "users",
        let: { myID: "$_id", friendsIDs: "$friendsIDs" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // my friends are the ones who are on my friendsIDs list, and where i am ALSO on their friendsIDs list
                  { $in: ["$_id", "$$friendsIDs"] },
                  { $in: ["$$myID", { $ifNull: ["$friendsIDs", []] }] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "friends",
      },
    },
    // Project so that I do not return all my profile info, only the new "friends" field; id: 0 also removes my _id from each of my friends documents
    {
      $project: {
        friends: 1,
        _id: 0,
      },
    },
    // create an individual document for each of my friends; i.e. split the "friends" array into documents where "friends" is root of each one and document is the friend
    { $unwind: "$friends" },
    // remove the "friends" root on each document, so that we just have individual documents that are my friends. yew!
    {
      $replaceRoot: {
        newRoot: "$friends",
      },
    },
  ]);

  const arrayOfIDs = friends.map((object) => object._id);

  return arrayOfIDs;
  //const meWithFriends = await User.findById(user._id).populate("friendsIDs");
  //return meWithFriends.friendsIDs;
}

// async function getAllFriendsIDs(userID) { // DEP
//   const { friendsIDs } = await User.findById(userID, "friendsIDs");

//   //updateFriendsSnippetToFriendsIDs();
//   return friendsIDs;
// }

async function getUserByID(userID) {
  return await User.findById(userID);
}

async function getUserProfile(myUserID, usernameOfProfile) {
  // Relation options: MYSELF, FRIEND, REQUESTER, REQUESTED, NONE
  const user = await User.findOne({ username: usernameOfProfile });
  return user;
}

async function searchUsers(userID, input) {
  const {
    skip = 0,
    limit = 100,
    searchText,
    sortOrder,
    includeMyself = true,
    includeBuddies = true,
    includeOffersReceived = true,
    includeOffersSent = true,
    includePotentials = true,
  } = input;

  const { friendsIDs } = await User.findById(userID, "friendsIDs");
  const friendsIDsObjectIDType = friendsIDs.map((id) => Types.ObjectId(id));

  // Match condition to see if userID is on other persons' friends list
  const iAmOnTheirList = {
    $in: [Types.ObjectId(userID), { $ifNull: ["$friendsIDs", []] }],
  };

  // Match condition to see if other person is on userIDs friends list
  const theyAreOnMyList = {
    $in: ["$_id", friendsIDsObjectIDType],
  };

  // const sortState = {
  //   $sort: {}
  // }

  const calculateSkips = (counts) => {
    // Return skips, or 0 if skips is calculated to be negative
    return {
      myself: Math.max(0, skip),
      buddies: Math.max(0, skip - counts.myself),
      offersReceived: Math.max(0, skip - counts.myself - counts.buddies),
      offersSent: Math.max(
        0,
        skip - counts.myself - counts.buddies - counts.offersReceived
      ),
      potentials: Math.max(
        0,
        skip -
          counts.myself -
          counts.buddies -
          counts.offersReceived -
          counts.offersSent
      ),
    };
  };

  const calculateLimits = (counts, skips) => {
    // Return limits on each relation facet; 0 if GQL input does not ask for this relation, and also 0 if limit is calculated to be negative
    // Calculation for users in stage = input limit - previousUserCount + previousSkips
    return {
      myself: includeMyself ? Math.max(0, limit) : 0,
      buddies: includeBuddies
        ? Math.max(0, limit + skips.myself - counts.myself)
        : 0,
      offersReceived: includeOffersReceived
        ? Math.max(
            0,
            limit -
              counts.myself -
              counts.buddies +
              skips.myself +
              skips.buddies
          )
        : 0,
      offersSent: includeOffersSent
        ? Math.max(
            0,
            limit -
              counts.myself -
              counts.buddies -
              counts.offersReceived +
              skips.myself +
              skips.buddies +
              skips.offersReceived
          )
        : 0,
      potentials: includePotentials
        ? Math.max(
            0,
            limit -
              counts.myself -
              counts.buddies -
              counts.offersReceived -
              counts.offersSent +
              skips.myself +
              skips.buddies +
              skips.offersReceived +
              skips.offersSent
          )
        : 0,
    };
  };

  // Get total counts of users in each relation category so that I can calculate skips and limits for each
  const countsRes = await User.aggregate([
    {
      // Search Username or Name fields for partial text match
      $match: {
        $or: [
          {
            username: {
              $regex: searchText,
              $options: "i",
            },
          },
          {
            name: {
              $regex: searchText,
              $options: "i",
            },
          },
        ],
      },
    },
    // Break results into relationship categories: MYSELF, FRIEND, REQUESTER, REQUESTED, NONE
    {
      $facet: {
        totalCount: [{ $count: "value" }],
        myself: [
          {
            $match: { _id: Types.ObjectId(userID) },
          },
          { $count: "count" },
        ],
        buddies: [
          {
            $match: {
              $expr: {
                $and: [iAmOnTheirList, theyAreOnMyList],
              },
            },
          },
          { $count: "count" },
        ],
        offersSent: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $not: iAmOnTheirList,
                  },
                  theyAreOnMyList,
                ],
              },
            },
          },
          { $count: "count" },
        ],
        offersReceived: [
          {
            $match: {
              $expr: {
                $and: [
                  iAmOnTheirList,
                  {
                    $not: theyAreOnMyList,
                  },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        potentials: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $not: iAmOnTheirList,
                  },
                  {
                    $not: theyAreOnMyList,
                  },
                ],
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  // Reorganize countsRes into a simple object
  const counts = {
    total: countsRes[0].totalCount[0] ? countsRes[0].totalCount[0].value : 0,
    myself: countsRes[0].myself[0] ? countsRes[0].myself[0].count : 0,
    buddies: countsRes[0].buddies[0] ? countsRes[0].buddies[0].count : 0,
    offersReceived: countsRes[0].offersReceived[0]
      ? countsRes[0].offersReceived[0].count
      : 0,
    offersSent: countsRes[0].offersSent[0]
      ? countsRes[0].offersSent[0].count
      : 0,
    potentials: countsRes[0].potentials[0]
      ? countsRes[0].potentials[0].count
      : 0,
  };

  // Calculate skips and limits for each of the 5 relationship facets, based on total uesrs in each facet and skip and limit input
  const skips = calculateSkips(counts);
  const limits = calculateLimits(counts, skips);

  // Determine if limit should be 0 for a stage, or if gql input does not want these people; we cant have limit: 0 in MONGODB so we cancel a stage this way
  const searchMyself = limits.myself > 0;
  const searchBuddies = limits.buddies > 0;
  const searchOffersReceived = limits.offersReceived > 0;
  const searchOffersSent = limits.offersSent > 0;
  const searchPotentials = limits.potentials > 0;

  console.log(`counts: `, counts);

  console.log(`skips:`, skips);
  console.log(`limits:`, limits);

  const res = await User.aggregate([
    {
      // Search Username or Name fields for partial text match
      $match: {
        $or: [
          {
            username: {
              $regex: searchText,
              $options: "i",
            },
          },
          {
            name: {
              $regex: searchText,
              $options: "i",
            },
          },
        ],
      },
    },
    // Break results into relationship categories: MYSELF, FRIEND, REQUESTER, REQUESTED, NONE
    {
      $facet: {
        // totalCount: [{ $count: "value" }],
        myself: [
          {
            $match: searchMyself
              ? { _id: Types.ObjectId(userID) }
              : { _id: "null" },
          },
          { $skip: skips.myself },
          { $limit: limits.myself > 0 ? limits.myself : 1 }, // cuz cant have a 0 limit here.  if limit is 0 though, match stage will return nothing
        ],
        buddies: [
          {
            $match: searchBuddies
              ? {
                  $expr: {
                    $and: [iAmOnTheirList, theyAreOnMyList],
                  },
                }
              : { _id: "null" },
          },
          { $skip: skips.buddies },
          { $limit: limits.buddies > 0 ? limits.buddies : 1 },
        ],
        offersSent: [
          {
            $match: searchOffersSent
              ? {
                  $expr: {
                    $and: [
                      {
                        $not: iAmOnTheirList,
                      },
                      theyAreOnMyList,
                    ],
                  },
                }
              : { _id: "null" },
          },
          { $skip: skips.offersSent },
          { $limit: limits.offersSent > 0 ? limits.offersSent : 1 },
        ],
        offersReceived: [
          {
            $match: searchOffersReceived
              ? {
                  $expr: {
                    $and: [
                      iAmOnTheirList,
                      {
                        $not: theyAreOnMyList,
                      },
                    ],
                  },
                }
              : { _id: "null" },
          },
          { $skip: skips.offersReceived },
          { $limit: limits.offersReceived > 0 ? limits.offersReceived : 1 },
        ],
        potentials: [
          {
            $match: searchPotentials
              ? {
                  $expr: {
                    $and: [
                      {
                        $not: iAmOnTheirList,
                      },
                      {
                        $not: theyAreOnMyList,
                      },
                    ],
                  },
                }
              : { _id: "null" },
          },
          { $skip: skips.potentials },
          { $limit: limits.potentials > 0 ? limits.potentials : 1 },
        ],
      },
    },
  ]);

  console.log(`res in mongo:`, res);
  return res[0];
}

module.exports = {
  getMyProfile,
  getMyFriends,
  getMyBuddiesIDs,
  getUserByID,
  getUserProfile,
  searchUsers,
};
