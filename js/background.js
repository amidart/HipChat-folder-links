(function() {

  var URL = 'https://hipchat.com/chat';
  var native_host = 'com.hipchat.linkshelper';


  var init = function(args){

    runInstaller();

    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({url: URL});
    });

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (!sender.tab) return;
        console.log(request);
        if (request.cmd === 'openFile') {
          openFile(request.data);
        }
        else if (request.cmd === 'openDir') {
          openDir(request.data);
        }
      });
  };


  var runInstaller = function(){
    if (!localStorage.installed) {
      chrome.tabs.create({url:"/host/HipChatLinksHelper_install.exe"});
      localStorage.installed = true;
    }
  };


  var openFile = function(data){
    data.cmd = 'openfile';
    sendNativeMessage(data);
  };

  var openDir = function(data){
    data.cmd = 'opendir';
    sendNativeMessage(data);
  };

  /**
   * data = {
   *   cmd: ('openfile'|'opendir')
   *   file: 'path/to/file',
   *   dir: 'path/do/dir'
   * }
   */
  var sendNativeMessage = function(data){
    console.log('Send message:');
    console.log(data);
    chrome.runtime.sendNativeMessage(native_host,
      data,
      function(response) {
        console.log(response);
      });
  };


  init();

})();
