const moment = require("moment-timezone");

function calculateFlightDuration(departure, arrival, depTimeZone, arrTimeZone) {
  const departureTime = moment.tz(departure, depTimeZone);
  console.log(departureTime , "DepTime")
  const arrivalTime = moment.tz(arrival, arrTimeZone);
  console.log(arrivalTime)

  const duration = moment.duration(arrivalTime.diff(departureTime));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  return `${hours}h ${minutes}m`;   
}

// Example Usage
const departure = "2024-12-05T14:00:00";
const arrival = "2024-12-05T17:30:00";
const depTimeZone = "Asia/Kolkata";
const arrTimeZone = "Asia/Riyadh";

const duration = calculateFlightDuration(
  departure,
  arrival,
  depTimeZone,
  arrTimeZone
);
console.log(`Flight Duration: ${duration}`); // Output: "6h 0m"

  