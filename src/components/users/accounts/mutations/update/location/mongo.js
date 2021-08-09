const { User } = require("../../../../model");

async function updateProfileLocation(input, userID) {
  const { coordinates, nearestLocation } = input;
  return await User.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        loc: {
          type: "Point",
          coordinates,
          properties: {
            nearestLocation: {
              loc: {
                type: "Point",
                coordinates: nearestLocation.coordinates,
              },
              placeType: nearestLocation.placeType,
              text: nearestLocation.text,
            },
          },
        },
      },
    },
    { upsert: false, new: true, rawResult: true, runValidators: true }
  );
}

module.exports = {
  updateProfileLocation,
};
