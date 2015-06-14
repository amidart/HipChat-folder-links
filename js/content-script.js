var Module = (function(my){

  my.init = function() {
    var timer = setInterval(function(){
      if ( document.querySelector('.message-list') ) {
        clearInterval(timer);
        observerInit();
      }
    }, 500);
  };



  /**
   * =========================== Observer
   */
  function observerInit () {
    var target = document.querySelector('.hc-chat-panel');

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes[0]) {
          console.log(mutation.addedNodes);
          if ( mutation.addedNodes[0].className.match(/date-block/) ) {
            processChildList(mutation.addedNodes[0].childNodes, false);
          }
          else if(mutation.addedNodes[0].className.match(/hc-msg-yellow/)) {
            processChildList( mutation.addedNodes, false);
          }
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
        className = nodes[i].className;
      } catch (e) {}
      if (typeof className === 'string' && className.match(/hc-msg-yellow/)) {
        processNode(nodes[i], remove);
      }
    }
  }


  function processNode (node, remove) {
    var a = node.querySelector('.msg-line a');
    if (!a) return;
    var text = a.textContent;
    if (text.match(/^(\\\\|\w:).*/)) {
      var filePath = text;
      var dirPath = text.replace(/^(.*)\\.*?\.\w+$/, '$1');

      a.setAttribute('href', 'file://' + dirPath);
      a.setAttribute('target', '_blank');
      a.addEventListener('click', function(e){
        e.preventDefault();
        chrome.runtime.sendMessage({cmd: "openDir", data: {file: filePath, dir: dirPath}}, null);
      });

      var links = generateLinks(filePath, dirPath);
      a.parentNode.appendChild(links);
    }
  }


  /**
   * Generates links for each chat message with file link
   * @param  {string} filePath
   * @param  {string} dirPath
   * @return {HTMLElement}  DOM element with generated links
   */
  var generateLinks = function(filePath, dirPath){
    var wrap = document.createElement('span');
    wrap.className = 'hipchatlinkshelper';
    appendExplorerLinks(wrap, filePath, dirPath);
    appendBrowserLinks(wrap, filePath, dirPath);
    return wrap;
  };


  var appendExplorerLinks = function(wrap, filePath, dirPath){
    wrap.insertAdjacentHTML('beforeend', 'Explorer: ');
    wrap.appendChild( HTMLHelpers.a('folder', '#', '', function(e){
      e.preventDefault();
      chrome.runtime.sendMessage({cmd: "openDir", data: {file: filePath, dir: dirPath}}, null);
    }));

    wrap.appendChild( HTMLHelpers.a('file', '#', '', function(e){
      e.preventDefault();
      chrome.runtime.sendMessage({cmd: "openFile", data: {file: filePath, dir: dirPath}}, null);
    }));
  };


  var appendBrowserLinks = function(wrap, filePath, dirPath){
    wrap.insertAdjacentHTML('beforeend', '&nbsp;&nbsp;&nbsp;Browser: ');
    wrap.appendChild( HTMLHelpers.a('folder', 'file://' + dirPath, '_blank', function(e){
      e.preventDefault();
      chrome.runtime.sendMessage({cmd: "newTab", data: this.href}, null);
    }) );
    wrap.appendChild( HTMLHelpers.a('file', 'file://' + filePath, '_blank', function(e){
      e.preventDefault();
      chrome.runtime.sendMessage({cmd: "newTab", data: this.href}, null);
    }) );
  };



  return my;

})(Module || {});


var HTMLHelpers = {
  a: function(anchor, href, target, onclick){
    var a = document.createElement('a');
    a.textContent = anchor;
    a.setAttribute('href', href);
    a.setAttribute('target', target);
    a.onclick = onclick;
    return a;
  }
};


Module.init();
