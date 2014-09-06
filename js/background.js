(function() {

  var URL = 'https://hipchat.com/chat';

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: URL});
  });


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (!sender.tab) return;
      if (request.cmd === 'openExplorer') {
        console.log('send message');
        chrome.runtime.sendNativeMessage('com.hipchat.explorer',
          { p: request.data },
          function(response) {
            console.log(response.text);
          });
      }
    });

})();
