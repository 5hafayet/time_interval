var workTime = 25 * 60; // in seconds
var breakTime = 5 * 60; // in seconds
var intervalID;

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  intervalID = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.text(minutes + ":" + seconds);

    if (--timer < 0) {
      clearInterval(intervalID);
      var audio = new Audio("alarm.mp3");
      audio.play();
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Pomodoro Timer",
        message: "Time's up!",
        requireInteraction: true,
      });
      setTimeout(function () {
        startTimer(breakTime, display);
      }, 5000);
    }
  }, 1000);
}

chrome.browserAction.onClicked.addListener(function (tab) {
  var display = $('<div style="font-size: 50px; text-align: center;"></div>');
  var popup = $('<div style="height: 100px;"></div>').append(display);

  chrome.notifications.clear("Pomodoro Timer");
  chrome.notifications.onClicked.addListener(function (notificationId) {
    chrome.notifications.clear(notificationId);
    startTimer(workTime, display);
  });

  startTimer(workTime, display);

  chrome.browserAction.setPopup({
    tabId: tab.id,
    popup: popup[0].outerHTML,
  });
});
