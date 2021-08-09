// const addYears = require("date-fns/addYears");
// const addMonths = require("date-fns/addMonths");
// const addWeeks = require("date-fns/addWeeks");
const addDays = require("date-fns/addDays");
// const addHours = require("date-fns/addHours");
// const addMinutes = require("date-fns/addMinutes");
// const addSeconds = require("date-fns/addSeconds");

function convertDateToYYYYMMDD(date) {
  return date
    .toISOString()
    .split(/-|T|:/)
    .slice(0, 3)
    .join("");
}

function convertYYYYMMDDToDate(dateStamp, hour) {
  const date = new Date(
    Date.UTC(
      dateStamp.slice(0, 4),
      dateStamp.slice(4, 6) - 1,
      dateStamp.slice(6, 8),
      hour ? hour : 0,
      0,
      0,
      0
    )
  );

  return date;
  // Alternative: just build string:
  // dateStamp.slice(0, 4) +
  // "-" +
  // dateStamp.slice(4, 6) +
  // "-" +
  // dateStamp.slice(6, 8) +
  // "T00:00:00.000Z"
}

function buildArrayOfYYYYMMDD(startDate, durationOfDays) {
  const arrayOfYYYYMMDD = [];
  for (let i = 0; i <= durationOfDays; i++) {
    arrayOfYYYYMMDD.push(convertDateToYYYYMMDD(addDays(startDate, i)));
  }
  return arrayOfYYYYMMDD;
}

module.exports = {
  convertDateToYYYYMMDD,
  convertYYYYMMDDToDate,
  buildArrayOfYYYYMMDD
};
