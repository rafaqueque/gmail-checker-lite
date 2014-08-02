function gmailCheckerLite() {
    // private vars
    var options;
    var xhr; 
    var soundNotification;

    // main options & configuration
    this.options = {
        gmail_url: 'https://mail.google.com',
        gmail_atom_feed: 'https://mail.google.com/mail/u/0/feed/atom',
        check_cycle: (1000 * localStorage.gml_seconds),
        sound_notification: localStorage.gml_sound_notification ? true : false,
        sound_notification_filepath: '../sounds/'+localStorage.gml_sound_notification,
        icon_click_action: localStorage.gml_icon_click_action,
    };
    
    // method that takes care of the initialization of the class
    this.setup = function() {
        self = this;

        xhr = new XMLHttpRequest();
        options = self.options;

        if (options.sound_notification) {
            localStorage.gml_email_count = 0;
            soundNotification = new Audio(options.sound_notification_filepath);
        }

        self.check();
        setInterval(function(){ self.check(); }, options.check_cycle);

        chrome.browserAction.onClicked.addListener(function (tab) {
            switch(options.icon_click_action) {
                default:
                case 'primary':
                    url_match = options.gmail_url+'/mail/u/0';
                    break;
                case 'first':
                    url_match = options.gmail_url;
                    break;
            }

            chrome.tabs.getAllInWindow(undefined, function(tabs) {
                for (var i = 0, tab; tab = tabs[i]; i++) {
                    if (tab.url.indexOf(url_match) > -1) {
                        chrome.tabs.update(tab.id, {selected: true});
                        return true;
                    }
                }

                chrome.tabs.create({
                    url: options.gmail_url
                });
            });
        });

        return true;
    };

    // method to check the actual gmail unread messages count
    this.check = function() {
        if (!xhr)
            return false;

        xhr.open("GET", options.gmail_atom_feed, true);
        xhr.onreadystatechange = function() {
            if (xhr.status == 200) {
                var xml = xhr.responseXML;
                if (xml) {
                    var count = xml.getElementsByTagName('fullcount')[0].textContent || 0;

                    if (count > 0) {
                        chrome.browserAction.setBadgeText({text: count});
                        chrome.browserAction.setBadgeBackgroundColor({color: '#ff0000'});

                        if (count > localStorage.gml_email_count && options.sound_notification) {
                            soundNotification.play();
                        }
                    }
                    else {
                        chrome.browserAction.setBadgeText({text: ''});
                    }

                    localStorage.gml_email_count = count;
                }
                else {
                    chrome.browserAction.setBadgeText({text: '--'});
                    chrome.browserAction.setBadgeBackgroundColor({color: '#f3f3f3'});
                }
            }
            else {
                chrome.browserAction.setBadgeText({text: '--'});
                chrome.browserAction.setBadgeBackgroundColor({color: '#f3f3f3'});
            }
        }
        xhr.send();

        return true;
    };

    return true;
}

// go, go, go!
gmail = new gmailCheckerLite();
gmail.setup();
