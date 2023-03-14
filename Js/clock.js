startTime();

function startTime() {
    // var today = new Date();
    // var h = today.getHours();
    // var m = today.getMinutes();
    // var s = today.getSeconds();
    // m = checkTime(m);
    // s = checkTime(s);
    // document.getElementById('clockTime').innerHTML =
    // h + ":" + m + " AM";
    $('#clockClock').html(moment().format('hh:mm A'));
    $('#clockTime').html(moment().format('dddd'));
    $('#clockDate').html(moment().format('MMMM D, YYYY'));
    var t = setTimeout(startTime, 1000);
  }
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
    }

function startDate() {

}