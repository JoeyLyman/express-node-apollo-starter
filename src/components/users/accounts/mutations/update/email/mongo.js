const { User } = require("../../../../model");

async function isEmailAlreadyTaken(emailAddress) {
  const res = await User.findOne({
    email: { address: emailAddress, confirmed: true },
  });

  return res ? true : false;
}

async function addNewEmailAddress(input, userID) {
  const { emailAddress } = input;
  return await User.findOneAndUpdate(
    { _id: userID },
    { $set: { "email.newAddress": emailAddress } },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

// async function confirmNewEmailAddress(input, userID) {
//   const { emailAddress } = input;
//   const user = User.findOne({ _id: userID });
//   return await User.findOneAndUpdate(
//     { _id: userID },
//     {
//       $set: {
//         email: {
//           address: user.email.newAddress,
//           confirmed: true,
//           newAddress: null,
//         },
//       },
//     },
//     { upsert: false, new: true, rawResult: true, runValidators: true }
//   );
// }

module.exports = {
  isEmailAlreadyTaken,
  addNewEmailAddress,
};
