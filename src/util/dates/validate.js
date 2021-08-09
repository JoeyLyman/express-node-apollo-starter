function timeFrame(startTime, endTime) {
  errors = {};
  if (endTime <= startTime) {
    errors.time =
      "Start time must be earlier than end time - assuming constant gravitational forces.";
  }
  return {
    errors,
    valid: startTime <= endTime
  };
}

module.exports = { timeFrame };
