function gmailCheckerLite() {
    // private vars
    var options;
    var xhr;
    var soundNotification;
    var currentLoggedId = 0;
    
    // main options & configuration
    this.options = {
        gmail_url: 'https://mail.google.com',
        inbox_url: 'https://inbox.google.com',
        account_check_type: localStorage.gml_account_check_type,
        gmail_atom_feed: localStorage.gml_atom_feed,
        gmail_atom_feed_multi: localStorage.gml_atom_feed_multi,
        gmail_logged_max: 1,    // index based
        check_cycle: (1000 * localStorage.gml_seconds),
        sound_notification: localStorage.gml_sound_notification ? true : false,
        sound_notification_filepath: '../sounds/'+localStorage.gml_sound_notification,
        icon_click_action: localStorage.gml_icon_click_action,
        icon_click_url: localStorage.gml_icon_click_url
    };

    // method that takes care of the initialization of the class
    this.setup = function() {
        self = this;

        xhr = new XMLHttpRequest();
        options = self.options;

        if (options.sound_notification) {
            localStorage.gml_email_count_0 = 0;
            localStorage.gml_email_count_1 = 0;
            soundNotification = new Audio(options.sound_notification_filepath);
        }

        // check current email
        self.check();
        setInterval(function(){ self.check(); }, options.check_cycle);

        chrome.browserAction.onClicked.addListener(function (tab) {
            if (options.icon_click_url == 'classic') {
                switch(options.icon_click_action) {
                    case 'primary':
                        url_match = options.gmail_url+'/mail/u/0';
                        break;
                    case 'first':
                        url_match = options.gmail_url;
                        break;
                }
            }
            else
                url_match = options.inbox_url;
            
            chrome.tabs.getAllInWindow(undefined, function(tabs) {
                for (var i = 0, tab; tab = tabs[i]; i++) {
                    if (tab.url.indexOf(url_match) > -1) {
                        chrome.tabs.update(tab.id, {selected: true});
                        return true;
                    }
                }

                chrome.tabs.create({
                    url: url_match
                });
            });
        });

        return true;
    };

    // method to check the actual gmail unread messages count
    this.check = function() {

        if (!xhr)
            return false;

        // default feed URL
        atom_feed = options.gmail_atom_feed

        // multi account URL parsing
        if (options.account_check_type == 'multi') {
            currentLoggedId = (!currentLoggedId ? 1 : 0);
            if (currentLoggedId)
                atom_feed = options.gmail_atom_feed_multi.replace('__ID__', currentLoggedId);
        }

        // check for emails
        xhr.open("GET", atom_feed, true);
        xhr.onreadystatechange = function() {
            if (xhr.status == 200) {
                var xml = xhr.responseXML;
                if (xml) {
                    var count = xml.getElementsByTagName('fullcount')[0].textContent || 0;
                    var current_count = localStorage['gml_email_count_'+currentLoggedId]

                    if (count > 0) {

                        badge_color = '#ff0000';
                        // if the current feed URL is different from the default one, means
                        // there's multi account support.
                        if (options.account_check_type == 'multi')
                            badge_color = (!currentLoggedId ? '#ff0000' : '#0000ff');

                        chrome.browserAction.setBadgeText({text: count});
                        chrome.browserAction.setBadgeBackgroundColor({color: badge_color});

                        if (count > current_count && options.sound_notification) {
                            soundNotification.play();
                        }
                    }
                    else {
                        chrome.browserAction.setBadgeText({text: ''});
                    }

                    localStorage['gml_email_count_'+currentLoggedId] = count;
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
