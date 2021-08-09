const { Waitlister } = require("./model");

async function joinWaitlist(email) {
  const res = await Waitlister.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
      },
    },
    { upsert: true, new: true, rawResult: true, runValidators: true }
  );

  if (res.value) {
    return { success: true, message: "Joined waitlist", code: "200" };
  } else {
    return { success: false, message: e, code: "500" };
  }
}

module.exports = { joinWaitlist };
