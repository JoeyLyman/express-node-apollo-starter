const { model, Schema } = require("mongoose");

const signupCodeSchema = new Schema({
  _id: String,
  used: Boolean,
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const SignupCode = model("SignupCode", signupCodeSchema, "signupCodes");

module.exports = { SignupCode };
