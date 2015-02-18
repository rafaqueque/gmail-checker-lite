function init() {
  if (!localStorage.gml_icon)
    localStorage.gml_icon = "dark";

  if (!localStorage.gml_seconds)
    localStorage.gml_seconds = 60;

  if (!localStorage.gml_atom_feed)
    localStorage.gml_atom_feed = 'https://mail.google.com/mail/feed/atom/';

  if (!localStorage.gml_atom_feed_multi)
    localStorage.gml_atom_feed_multi = 'https://mail.google.com/mail/u/__ID__/feed/atom/';

  if (!localStorage.gml_icon_click_action)
    localStorage.gml_icon_click_action = 'primary';

  if (!localStorage.gml_icon_click_url)
    localStorage.gml_icon_click_url = 'classic';

  chrome.browserAction.setIcon({
      path: {
          "19": "img/icon_"+localStorage.gml_icon+".png",
          "38": "img/icon_"+localStorage.gml_icon+"_retina.png"
      }
  });
}

init();
