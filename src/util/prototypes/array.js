function getArrayDepth(value) {
  return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0;
}

module.exports = { getArrayDepth };
