// bounding boxes: [minLon,minLat,maxLon,maxLat]
// i.e.
// - bbox: [-178.333232, 21.254914, -157.648708, 28.402123]
// - polygon: [[[-178.333232, 21.254914], [-178.333232, 28.402123], [-157.648708, 28.402123], [-157.648708, 21.254914], [-178.333232, 21.254914]]]

function bboxToPolygon(bbox) {
  const polygon = [
    [
      [bbox[0], bbox[1]],
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
    ],
  ];
  // console.log(`polygon computed:`, polygon);
  // console.log(
  //   `polygon as it should be: [[[-178.333232, 21.254914], [-178.333232, 28.402123], [-157.648708, 28.402123], [-157.648708, 21.254914], [-178.333232, 21.254914]]]`
  // );

  return polygon;
}

module.exports = { bboxToPolygon };
