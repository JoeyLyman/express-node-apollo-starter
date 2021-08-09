const db = require("./mongo");

async function joinWaitlist(email) {
  const re = /\S+@\S+\.\S+/;

  const isEmailValid = re.test(email);

  if (!isEmailValid) {
    return {
      code: 500,
      success: false,
      message: "Invalid email address.",
    };
  }

  return await db.joinWaitlist(email);
}

module.exports = { joinWaitlist };
