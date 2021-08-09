const { SignupCode } = require("./model");

async function checkSignupCode(signupCode) {
  const codeExists = await SignupCode.findById(signupCode);
  if (codeExists && codeExists.used === false) {
    return true;
  } else {
    return false;
  }
}

async function updateSignupCodeAfterUse(signupCode, userID) {
  const res = await SignupCode.findByIdAndUpdate(
    signupCode,
    {
      $set: {
        used: true,
        userID,
      },
    },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
  return res;
}

module.exports = { checkSignupCode, updateSignupCodeAfterUse };
