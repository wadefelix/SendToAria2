browser.contextMenus.create({
    id: "send-to-aria2",
    title: "send to aria2 server",
    contexts: ["link"],
});

function S2A2_xmlhttpRequest(dlurl, filename) {
  try {
    browser.storage.local.get('aria2server').then((res) => {
      if (!res.aria2server) return
    
    var oReq = new XMLHttpRequest();
    /*oReq.addEventListener("load", function(a1, a2, a3) {
      console.log('xhr.load: %s, %s, %s', a1, a2, a3);
    });*/
    var dlparams = {}
    if (filename.length>0) dlparams['out'] = filename;

    jsonreq = {'jsonrpc':'2.0',
               'id':'qwer',
               'method':'aria2.addUri',
               'params': [[dlurl],dlparams]}
    jsonreqstr = JSON.stringify(jsonreq);
    // open synchronously
    oReq.open("post",res.aria2server,false);

    // send
    var res = oReq.send(jsonreqstr);
    //console.log('xhr result: %s', res);
    
    });
  } catch(e) {
    debugger;
    console.warn('could not send ajax request, reason %s', e.toString());
  }
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "send-to-aria2") {
        // Examples: text and HTML to be copied.
        const text = "This is text: " + info.linkUrl;
        // Always HTML-escape external input to avoid XSS.
        const safeUrl = escapeHTML(info.linkUrl);
        
        browser.tabs.sendMessage(tab.id, safeUrl);
    }
});

browser.runtime.onMessage.addListener(function (info) {
  S2A2_xmlhttpRequest(info.url, info.filename);
});


// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}