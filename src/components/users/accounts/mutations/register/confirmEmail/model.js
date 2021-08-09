const { model, Schema } = require("mongoose");

const confirmEmailTokenSchema = new Schema({
  username: String,
  email: String,
  token: String,
  createdAt: { type: Date, required: true, default: Date.now, expires: 432000 }
});

confirmEmailTokenSchema.index({ token: 1 }, { unique: true });
confirmEmailTokenSchema.index({ username: 1 }, { unique: true });

const ConfirmEmailToken = model(
  "ConfirmEmailToken",
  confirmEmailTokenSchema,
  "confirmEmailTokens"
);

module.exports = { ConfirmEmailToken };
