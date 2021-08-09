const geolib = require("geolib");

const NoaaWW3Station = require("../models/NoaaWW3Station");
const NoaaCoopsBuoy = require("../models/NoaaCoopsBuoy");
const NoaaRealtimeBuoy = require("../models/NoaaRealtimeBuoy");
const NwsGridpoint = require("../models/NwsGridpoint");
const Spot = require("../models/Spot");

async function getAllBuoys() {
  const noaaWW3Stations = await NoaaWW3Station.find();
  const noaaCoopsBuoys = await NoaaCoopsBuoy.find();
  const noaaRealtimeBuoys = await NoaaRealtimeBuoy.find();
  const nwsGridpoints = await NwsGridpoint.find();
  return {
    noaaWW3Stations,
    noaaCoopsBuoys,
    noaaRealtimeBuoys,
    nwsGridpoints
  };
}

async function getSpotAssociatedBuoys(buoyType, returnObject) {
  // TODO: Validate input
  console.log(
    `Beginning to fetch all spot associated buoys through getSpotAssociatedBuoys(buoyType: ${buoyType}, returnObject: ${returnObject})`
  );
  if (
    [
      "nwsGridpoint",
      "noaaWW3Stations",
      "noaaCoopsBuoys",
      "noaaRealtimeBuoys"
    ].indexOf(buoyType) < 0
  ) {
    console.log(
      `Incorrect buoyType for getSpotAssociatedBuoys(); options are: "nwsGridpoint" || "noaaWW3Stations" || "noaaCoopsBuoys" || "noaaRealtimeBuoys"`
    );
  }
  const buoyIds = await Spot.distinct(buoyType, function(err, result) {
    if (err) return handleError(err);
    return result;
  });
  if (!returnObject) {
    console.log(
      `Found these buoy IDs from getSpotAssociatedBuoys(buoyType: ${buoyType}, returnObject: ${returnObject}):`,
      buoyIds
    );
    return buoyIds;
  } else {
    switch (buoyType) {
      case "nwsGridpoint":
        buoysPopulated = await NwsGridpoint.find({
          _id: { $in: buoyIds }
        });
        break;
      case "noaaWW3Stations":
        buoysPopulated = await NoaaWW3Station.find({
          _id: { $in: buoyIds }
        });
        break;
      case "noaaCoopsBuoys":
        buoysPopulated = await NoaaCoopsBuoy.find({
          _id: { $in: buoyIds }
        });
        break;
      case "noaaRealtimeBuoys":
        buoysPopulated = await NoaaRealtimeBuoy.find({
          _id: { $in: buoyIds }
        });
    }

    console.log(
      `Found these buoy IDs from getSpotAssociatedBuoys(buoyType: ${buoyType}, returnObject: ${returnObject}):`,
      buoysPopulated[0].locationId
        ? buoysPopulated.map(buoy => buoy.locationId) // for all others
        : buoysPopulated.map(buoy => buoy.forecastGridData) // for nwsGridpoint
    );
    return buoysPopulated;
  }
}

async function getBuoysWithinRadius(buoys, meters, lat, long) {
  const buoysWithinRadius = buoys.filter(buoy =>
    geolib.isPointWithinRadius(
      { latitude: buoy.coordinates.lat, longitude: buoy.coordinates.long },
      { latitude: lat, longitude: long },
      meters
    )
  );
  return buoysWithinRadius;
}

async function getAllBuoysWithinRadius(meters, lat, long) {
  console.log(`Beginning to fetch all NOAA buoys from database...`);
  const allBuoys = await getAllBuoys();
  const noaaWW3Stations = allBuoys.noaaWW3Stations.filter(buoy =>
    geolib.isPointWithinRadius(
      { latitude: buoy.coordinates.lat, longitude: buoy.coordinates.long },
      { latitude: lat, longitude: long },
      meters
    )
  );
  console.log(
    `All NOAA WW3 Stations from getAllBuoysWithinRadius(meters: ${meters}, lat: ${lat}, long: ${long}. Stations:`,
    noaaWW3Stations
  );
  const noaaRealtimeBuoys = allBuoys.noaaRealtimeBuoys.filter(buoy =>
    geolib.isPointWithinRadius(
      { latitude: buoy.coordinates.lat, longitude: buoy.coordinates.long },
      { latitude: lat, longitude: long },
      meters
    )
  );
  console.log(
    `All NOAA Realtime Buoys from getAllBuoysWithinRadius(meters: ${meters}, lat: ${lat}, long: ${long}. Stations:`,
    noaaRealtimeBuoys
  );
  const noaaCoopsBuoys = allBuoys.noaaCoopsBuoys.filter(buoy =>
    geolib.isPointWithinRadius(
      { latitude: buoy.coordinates.lat, longitude: buoy.coordinates.long },
      { latitude: lat, longitude: long },
      meters
    )
  );
  console.log(
    `All NOAA COOPS Buoys from getAllBuoysWithinRadius(meters: ${meters}, lat: ${lat}, long: ${long}. Stations:`,
    noaaCoopsBuoys
  );
  console.log(`Finished fetching all NOAA buoys from database.`);
  return {
    noaaWW3Stations,
    noaaRealtimeBuoys,
    noaaCoopsBuoys
  };
}

function getClosestBuoys(numberOfBuoys, buoyList, lat, long) {
  console.log(
    `Beginning to find closest ${numberOfBuoys} buoys to lat: ${lat}, long: ${long}`
  );
  const buoyListWithCoordinates = buoyList.map(function(buoy) {
    return {
      latitude: buoy.coordinates.lat,
      longitude: buoy.coordinates.long,
      buoy
    };
  });
  const orderedList = geolib
    .orderByDistance(
      { latitude: lat, longitude: long },
      buoyListWithCoordinates
    )
    .map(object => object.buoy);
  console.log(
    `Finished finding closest ${numberOfBuoys} buoys to lat: ${lat}, long: ${long}`
  );
  return orderedList.slice(0, numberOfBuoys);
}

module.exports = {
  getAllBuoys,
  getSpotAssociatedBuoys,
  getAllBuoysWithinRadius,
  getBuoysWithinRadius,
  getClosestBuoys
};
