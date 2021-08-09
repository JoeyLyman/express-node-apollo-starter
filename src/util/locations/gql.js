const { gql } = require("apollo-server-express");

const typeDef = gql`
  type Point {
    type: String
    coordinates: [Float]
    properties: PointProperties
  }

  type PointProperties {
    nearestLocation: NearestLocation
  }

  type NearestLocation {
    loc: Point
    placeType: [String]
    text: String
  }

  input PointInput {
    long: Float
    lat: Float
  }

  type Polygon {
    type: String
    coordinates: [[[Float]]]
  }

  input PolygonInput {
    coordinatesArray: [Coordinates]
  }

  input Coordinates {
    long: Float
    lat: Float
  }
`;

module.exports = { typeDef };
