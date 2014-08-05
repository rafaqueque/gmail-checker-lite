function init() {
  if (!localStorage.gml_icon)
    localStorage.gml_icon = "dark";

  if (!localStorage.gml_seconds)
    localStorage.gml_seconds = 60;

  if (!localStorage.gml_atom_feed)
    localStorage.gml_atom_feed = 'https://mail.google.com/mail/u/0/feed/atom/';

  if (!localStorage.gml_icon_click_action)
    localStorage.gml_icon_click_action = 'primary';

  chrome.browserAction.setIcon({path: "img/icon_"+localStorage.gml_icon+".png"});
}

init();
