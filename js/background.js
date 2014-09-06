(function() {

  var URL = 'https://hipchat.com/chat';

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: URL});
  });

})();
