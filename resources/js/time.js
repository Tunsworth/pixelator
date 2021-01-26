var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

document.addEventListener("DOMContentLoaded", function(e) {

function tick() {
  var currTime = new Date();
  var currSec;
  var currMin;
  var currHour;

  //leading zeroes
if (String(currTime.getSeconds()).length == 1) {
    currSec = "0" + String(currTime.getSeconds());
  } else {
    currSec = String(currTime.getSeconds());
  }

  if (String(currTime.getMinutes()).length == 1) {
    currMin = "0" + String(currTime.getMinutes());
  } else {
    currMin = String(currTime.getMinutes());
  }

  if (String(currTime.getHours()).length == 1) {
    currHour = "0" + String(currTime.getHours());
  } else {
    currHour = String(currTime.getHours());
  }

  document.getElementById("header").innerHTML =
    days[currTime.getDay()] +
    " " +
    currTime.getDate() +
    " " +
    months[currTime.getMonth()] +
    " " +
    currHour +
    ":" +
    currMin +
     ":" +
    currSec;
}

var secondCheck = setInterval(tick, 1000);
  
});


