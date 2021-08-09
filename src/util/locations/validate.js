// Point
function validatePoint(coordinates) {
  // must be an array (object)
  if (typeof coordinates !== "object") {
    throw new mongoose.Error("Point " + coordinates + " must be an array");
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.Error(
      "Point" + coordinates + " must contain two or three coordinates"
    );
  }
  // must have real numbers
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    throw new mongoose.Error("Point must have real numbers");
  }
  // must have two numbers
  if (
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    throw new mongoose.Error("Point must have two numbers");
  }
  // longitude must be within bounds
  if (coordinates[0] > 180 || coordinates[0] < -180) {
    throw new mongoose.Error(
      "Point" + coordinates[0] + " should be within the boundaries of longitude"
    );
  }
  // latitude must be within bounds
  if (coordinates[1] > 90 || coordinates[1] < -90) {
    throw new mongoose.Error(
      "Point" + coordinates[1] + " should be within the boundaries of latitude"
    );
  }
}

// LineString
function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

// Polygon
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// - counterclockwise? CHECK THIS
// - first point also needs to be last point in polygon
function validatePolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.Error(
        "Each Polygon LinearRing must have at least four elements"
      );
    }
    // the LinearRing objects must have identical start and end values
    if (
      !arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length - 1])
    ) {
      throw new mongoose.Error(
        "Each Polygon LinearRing must have an identical first and last point"
      );
    }
    // otherwise the LinearRings must correspond to a LineString
    validateLineString(coordinates[i]);
  }
}

module.exports = { validatePoint, validateLineString, validatePolygon };
