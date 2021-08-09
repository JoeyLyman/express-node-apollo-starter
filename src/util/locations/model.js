const { Schema } = require("mongoose");

// Coordinates: Long, lat

// Point
const pointObject = {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  properties: {
    nearestLocation: {
      loc: {
        type: {
          type: String,
          enum: ["Point"],
          // required: true,
        },
        coordinates: [Number],
      },
      placeType: [String],
      text: String,
    },
  },
};

const point = new Schema(pointObject, { _id: false });

// MultiPoint
const multiPointObject = {
  type: {
    type: String,
    enum: ["MultiPoint"],
    required: true,
  },
  coordinates: {
    type: [[Number]],
    required: true,
  },
  // properties: {
  //   name: String
  // }
};

const multiPoint = new Schema(multiPointObject, { _id: false });

// LineString
const lineStringObject = {
  type: {
    type: String,
    enum: ["LineString"],
    required: true,
  },
  coordinates: {
    type: [[Number]], // Array of arrays of arrays of numbers
    required: true,
  },
};

const lineString = new Schema(lineStringObject, { _id: false });

// MultiLineString
const multiLineStringObject = {
  type: {
    type: String,
    enum: ["MultiLineString"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true,
  },
};

const multiLineString = new Schema(multiLineStringObject, { _id: false });

// Polygon
const polygonObject = {
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true,
  },
  // properties: {
  //   name: String
  // }
};

const polygon = new Schema(polygonObject, { _id: false });

// MultiPolygon
const multiPolygonObject = {
  type: {
    type: String,
    enum: ["MultiPolygon"],
    required: true,
  },
  coordinates: {
    type: [[[[Number]]]], // Array of arrays of arrays of numbers
    required: true,
  },
  // properties: {
  //   name: String
  // }
};

const multiPolygon = new Schema(multiPolygonObject, { _id: false });

// Geometry Options Enum: enum of objects cannot be used in schema.. only enum of strings
// const geometryOptionsEnum = [
//   pointObject,
//   multiPointObject,
//   lineStringObject,
//   multiLineStringObject,
//   polygonObject,
//   multiPolygonObject
// ];

// TODO: if we have a mongoose type of "Object", it might not force schema to abide by enum options
// GeometryCollection
const geometryCollectionObject = {
  type: {
    type: String,
    enum: ["GeometryCollection"],
    required: true,
  },
  geometries: {
    type: [Object], // Array of arrays of arrays of numbers
    required: true,
  },
  // properties: {
  //   name: String
  // }
};

const geometryCollection = new Schema(geometryCollectionObject);

// TODO: is this used?
const regions = [
  "North Pacific",
  "South Pacific",
  "Hawaii",
  "North Atlantic",
  "South Atlantic",
];

module.exports = {
  point,
  multiPoint,
  lineString,
  multiLineString,
  polygon,
  multiPolygon,
  geometryCollection,
  regions,
};
