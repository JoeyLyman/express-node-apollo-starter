//var cloudinary = require("cloudinary").v2;
const cloudinary = require("@services/cloudinary/cloudinary");
const auth = require("@util/auth");
const db = require("./mongo");

async function updateProfilePictureUrl(input, context) {
  const { url, publicID } = input;
  const user = auth.app.checkAuth(context);

  // Res returns the old document
  const res = await db.updateProfilePictureUrl(input, user._id);
  //const { lastErrorObject, value: resUser } = res.toObject();
  const { lastErrorObject, value: resUser } = res;

  const newUserObject = {
    ...resUser.toObject(),
    profilePicture: { url, publicID },
  };

  // So take old doc (to get old publicID for profile pic), and delete it from cloudinary
  cloudinary.uploader.destroy(resUser.profilePicture.publicID, function (
    error,
    result
  ) {
    console.log(`cloudinary profile picture deletion error:`, error);
    console.log("cloudinary profile picture deletion result:", result);
  });

  if (!lastErrorObject.updatedExisting) {
    return {
      code: 500,
      success: false,
      message: `Error, User profile picture not updated.`,
      user: null,
    };
  }

  return {
    code: 200,
    success: true,
    message: `User: ${newUserObject.username} profile picture successfully updated!`,
    user: newUserObject,
  };
}

module.exports = {
  updateProfilePictureUrl,
};
