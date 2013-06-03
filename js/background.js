/* options */
var options = {
  gmail_url: 'https://gmail.com',
  gmail_atom_feed: 'https://mail.google.com/mail/feed/atom',
  check_cycle: (60 * localStorage.gml_seconds) /* seconds */
};

/* function to check Gmail */
function checkGmail()
{
  /* create a new instance */
  var xhr = new XMLHttpRequest();

  /* open new request to the gmail feed */
  xhr.open("GET", options.gmail_atom_feed, true);

  /* set a few options to handle on send */
  xhr.onreadystatechange = function() {

    /* if we connect successfuly */
    if (xhr.status == 200)
    {
      var xml = xhr.responseXML;
      if (xml)
      {
        /* get unread emails and account info */
        var count = xml.getElementsByTagName('fullcount')[0].textContent || 0;

        /* show badge only if there's any unread messages */
        if (count > 0)
        {
          chrome.browserAction.setBadgeText({text: count});
          chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});
        }
        else
        {
          /* remove badge */
          chrome.browserAction.setBadgeText({text: ''});
        }
      }
      else
      {
        /* if there's no valid xml, show an error */
        chrome.browserAction.setBadgeText({text: '--'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#f3f3f3'});
      }
    }
    else
    {
      /* if there's no connection */
      chrome.browserAction.setBadgeText({text: '--'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#f3f3f3'});
    }
  }

  /* finally, send */
  xhr.send();
}

/* init */
checkGmail();

/* check cycle */
setInterval(function(){
  checkGmail();
},options.check_cycle);

/* on icon click, launch gmail.com */
chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.getAllInWindow(undefined, function(tabs) {
      for (var i = 0, tab; tab = tabs[i]; i++)
      {
        /* check if there's any gmail tab open */
        if (tab.url.indexOf('mail.google.com') > -1)
        {
          /* change to gmail tab */
          chrome.tabs.update(tab.id, {selected: true});
          return true;
        }
      }

      /* create a gmail tab */
      chrome.tabs.create({
          url: options.gmail_url
      });
    });
});
