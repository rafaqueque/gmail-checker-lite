// load all settings and apply to the DOM
function loadSettings() {
  var parseIcon = {
    dark: 0,
    light: 1
  };
  document.querySelectorAll('input[name="icon"]')[parseIcon[localStorage.gml_icon]].checked = true;

  var parseSeconds = {
    60: 0,
    300: 1,
    900: 2,
    1800: 3,
    3600: 4,
    7200: 5,
    14400: 6
  };
  document.querySelectorAll('select[name="seconds"]')[0].selectedIndex = parseSeconds[localStorage.gml_seconds];
}

// save settings to the localStorage API
function saveSettings() {
  var selected_icon = document.querySelectorAll('input[name="icon"]:checked')[0].value;
  var selected_seconds = document.querySelectorAll('select[name="seconds"]')[0].options[document.querySelectorAll('select[name="seconds"]')[0].selectedIndex].value;
  var selected_sound_notification = document.querySelectorAll('select[name="sound_notification"]')[0].options[document.querySelectorAll('select[name="sound_notification"]')[0].selectedIndex].value;

  localStorage.gml_icon = selected_icon;
  localStorage.gml_seconds = selected_seconds;
  localStorage.gml_sound_notification = selected_sound_notification;

  document.querySelectorAll('#alert')[0].innerHTML = "Saved! This window will auto-close in 2 seconds.";

  chrome.browserAction.setIcon({path: "img/icon_"+localStorage.gml_icon+".png"});
  chrome.extension.getBackgroundPage().window.location.reload();

  setTimeout(function(){ window.close(); }, 2000);
}

// event handlers to load settings and save settings
document.addEventListener('DOMContentLoaded', loadSettings);
document.querySelector('#save').addEventListener('click', saveSettings);

// live previews when changing sounds
document.querySelector('select[name="sound_notification"]').addEventListener('change', function(){
  sound_notification = document.querySelectorAll('select[name="sound_notification"]')[0].options[document.querySelectorAll('select[name="sound_notification"]')[0].selectedIndex].value;
  if (sound_notification != 0) {
    var soundNotification = new Audio('../sounds/'+sound_notification);
    soundNotification.play();
  }
});
