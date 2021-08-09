const { model, Schema } = require("mongoose");

const waitlisterSchema = new Schema({
  email: String,
});

const Waitlister = model("Waitlister", waitlisterSchema, "waitlisters");

module.exports = { Waitlister };
