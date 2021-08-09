const { model, Schema } = require("mongoose");
const locations = require("@util/locations");

const discoverabilitiesEnum = ["username, name, phone, email"];

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  bio: String,
  loc: locations.model.point,
  email: {
    address: String,
    confirmed: Boolean,
    newAddress: String,
  },
  phoneNumber: {
    number: String,
    confirmed: Boolean,
  },
  password: String,
  profilePicture: {
    url: String,
    publicID: String,
  },
  spots: [
    {
      type: Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
  // friends: [
  //   {
  //     userID: {
  //       type: Schema.Types.ObjectId,
  //       ref: "User",
  //     },
  //     username: String,
  //   },
  // ],
  friendsIDs: [
    // to see if friendship is confirmed, see if you are listed in the other persons friendsIDs
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  discoverable: {
    type: [String],
    enum: discoverabilitiesEnum,
  },
  premiumSubscriber: [
    {
      updateTime: Date,
      value: Boolean,
      couponCode: String,
    },
  ],
  isDeleted: Boolean,
  lastLogin: Date,
});

// Indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index(
  { "email.address": 1 },
  {
    unique: true,
    partialFilterExpression: { "email.confirmed": { $eq: true } },
  }
);
// For searching users:
userSchema.index({ username: "text", name: "text" });

// TODO: friendsRequestedIDs so that you can see all your friend requests

const User = model("User", userSchema, "users");
User.createIndexes();
// by discoverabilities enum,
//User.path("username").index({ unique: true });

const userSnippet = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  username: String,
  //profilePic
});

module.exports = { User, userSnippet }; //model("User", userSchema);
