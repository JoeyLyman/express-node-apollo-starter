const db = require("./mongo");

async function checkSignupCode(signupCode) {
  const codeExistsAndIsAvailable = await db.checkSignupCode(signupCode);
  return codeExistsAndIsAvailable;
}

async function updateSignupCodeAfterUse(signupCode, userID) {
  return await db.updateSignupCodeAfterUse(signupCode, userID);
}

module.exports = { checkSignupCode, updateSignupCodeAfterUse };
