function init() {
  if (!localStorage.gml_icon)
    localStorage.gml_icon = "dark";

  if (!localStorage.gml_seconds)
    localStorage.gml_seconds = 60;

  chrome.browserAction.setIcon({path: "img/icon_"+localStorage.gml_icon+".png"});
}

init();
