var Module = (function(my){

  my.init = function() {
    observerInit();
  };


  /**
   * =========================== Observer
   */
  function observerInit () {
    var target = document.querySelector('#chats');

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          processChildList(mutation.addedNodes, false);
        }
      });
    });

    var config = { subtree: true, childList: true, characterData: true };
    observer.observe(target, config);
  }

  /**
   *
   */
  function processChildList (nodes, remove) {
    if (!nodes.length) return;
    for (var i = 0, len = nodes.length; i < len; i++) {
      var className = '';
      try {
        className = nodes[i].childNodes[0].className;
      } catch (e) {}
      if (className && className.match(/systemMessage-yellow/)) {
        processNode(nodes[i], remove);
      }
    }
  }


  function processNode (node, remove) {
    var a = node.querySelector('.messageBlock div a');
    if (!a) return;
    var text = a.textContent;
    if (text.match(/^\\\\.*/)) {
      var filePath = text;
      var dirPath = text.replace(/^(.*)\\.*?\.\w+$/, '$1');

      a.setAttribute('href', 'file://' + dirPath);
      a.setAttribute('target', '_blank');
      a.addEventListener('click', function(e){
        e.preventDefault();
        chrome.runtime.sendMessage({cmd: "openFile", data: {file: filePath, dir: dirPath}}, null);
      });
    }
  }


  return my;

})(Module || {});


Module.init();
