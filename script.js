let datetimeEle = document.querySelector("#datetime-input");
let timezoneEle = document.querySelector("#timezone-dropdown");
let dateFormatEle = document.querySelector("#dateFormat-input");
let timeFormatEle = document.querySelector("#timeFormat-input");
let timezoneTbl = document.querySelector("#timezone-tbl");

const timezones = ["UTC", "IST", "PST", "EST"];

function getTimezoneFromAbbreviation(abbreviation) {
  const allTimezones = moment.tz.names();
  const matchingTimezones = allTimezones.filter((tz) => {
    const timezoneAbbr = moment.tz(tz).format("z");
    return timezoneAbbr === abbreviation;
  });

  // If multiple timezones match the abbreviation, return the first one.
  // You might want to handle this case differently based on your requirements.
  if (matchingTimezones.length > 0) {
    return matchingTimezones[0];
  } else {
    // Return null if no matching timezone is found.
    return null;
  }
}

function convertToUTC(datetime, timezone) {
  const timezoneAbbr = getTimezoneFromAbbreviation(timezone);
  const utcDateTime = moment.tz(datetime, timezoneAbbr).utc().format();
  return utcDateTime;
}

function setDateTimes(datetimes) {
  let templateTableBody = `
    <tr class="table-light">
      <th scope="row">%tz%</th>
      <td>%date%</td>
      <td>%time%</td>
      <td>%day%</td>
    </tr>`;

  let tableRowHtml = "";
  for (var i in datetimes) {
    let kp = datetimes[i];
    let tableRow = templateTableBody
      .replace("%tz%", kp.tz)
      .replace("%date%", kp.date)
      .replace("%time%", kp.time)
      .replace("%day%", kp.day);

    tableRowHtml += tableRow;
  }

  timezoneTbl.querySelector("tbody").innerHTML = tableRowHtml;

  if (timezoneTbl.classList.contains("d-none"))
    timezoneTbl.classList.remove("d-none");
}

document.querySelector("#form-input").addEventListener("submit", (e) => {
  e.preventDefault();

  const datetime = datetimeEle.value;
  const timezone = timezoneEle.value;
  const dateFormat = dateFormatEle.value;
  const timeFormat = timeFormatEle.value;

  const utcTime = convertToUTC(datetime, timezone);
  const momentTime = moment(utcTime);

  const datetimes = timezones.map((tz) => {
    const tzAbbr = getTimezoneFromAbbreviation(tz);
    const parsedMoment = momentTime.tz(tzAbbr);
    const parsedDate = parsedMoment.format(dateFormat);
    const parsedTime = parsedMoment.format(timeFormat);
    const parsedDay = momentTime.format("ddd");

    return { tz: tz, date: parsedDate, time: parsedTime, day: parsedDay };
  });

  console.log(datetimes);
  setDateTimes(datetimes);
});
