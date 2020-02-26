browser.contextMenus.create({
    id: "send-to-aria2",
    title: "Send to Aria2 Directly",
    contexts: ["link"],
});
browser.contextMenus.create({
    id: "send-to-aria2-saveas",
    title: "Send to Aria2 Save As ...",
    contexts: ["link"],
});

var S2A2_Notification_ID = "S2A2-notification";
var S2A2_Notification_timeout_ID;
function S2A2_notify(title, cont) {
    browser.notifications.create(S2A2_Notification_ID, {
        "type": "basic",
        //"iconUrl": browser.extension.getURL("icons/cake-96.png"),
        "title": title,
        "message": cont
    }).then(()=>{
      S2A2_Notification_timeout_ID = setTimeout(() => {
        browser.notifications.clear(S2A2_Notification_ID);
      }, 5000);
    });
}

function S2A2_xmlhttpRequest(aria2server, aria2secret, dlurl, filename) {
  try {
    var oReq = new XMLHttpRequest();
    var dlparams = {}
    if (filename) dlparams['out'] = filename;

    jsonreq = {'jsonrpc':'2.0',
               'id':'qwer',
               'method':'aria2.addUri',
               'params': [[dlurl],dlparams]}
    if (aria2secret) {
        jsonreq.params.splice(0,0,'token:' + aria2secret)
    }
    jsonreqstr = JSON.stringify(jsonreq);
    // open synchronously
    oReq.open("post",aria2server,false);

    oReq.onload = function(e) {
      if (this.status == 200) {
        var resobj = JSON.parse(this.responseText);
        S2A2_notify("SendToAria2", resobj.result);
      } else {
          S2A2_notify("SendToAria2 ERROR", this.responseText);
      }
    };
    // send
    var res = oReq.send(jsonreqstr);
    //console.log('xhr result: %s', res);
  } catch(e) {
    //debugger;
    console.warn('could not send ajax request, reason %s', e.toString());
    S2A2_notify("SendToAria2 ERROR", e.toString());
  }
}

function S2A2_mkjob(dlurl, filename) {
    var pr = browser.storage.local.get('aria2server');
    var pt = browser.storage.local.get('aria2secret');
    Promise.all([pr,pt]).then((res) => {
      S2A2_xmlhttpRequest(res[0]['aria2server'],res[1]['aria2secret'],dlurl,filename)
    }).catch (reason=>{
        pr.then((res) => {
          S2A2_xmlhttpRequest(res['aria2server'],null,dlurl,filename)
        });
    });
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "send-to-aria2-saveas") {
        // Examples: text and HTML to be copied.
        // const text = "This is text: " + info.linkUrl;
        // Always HTML-escape external input to avoid XSS.
        const safeUrl = escapeHTML(info.linkUrl);
        
        browser.tabs.sendMessage(tab.id, safeUrl);
    } else if (info.menuItemId === "send-to-aria2") {
        S2A2_mkjob(escapeHTML(info.linkUrl), null);
    }
});

browser.runtime.onMessage.addListener(function (info) {
  S2A2_mkjob(info.url, info.filename);
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