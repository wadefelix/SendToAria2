browser.contextMenus.create({
    id: "send-to-aria2",
    title: "send to aria2 server",
    contexts: ["link"],
});

/*
"{\"jsonrpc\":\"2.0\",\"id\":\"qwer\",\"method\":\"aria2.addUri\",\"params\":[[\"
http:\\/\\/data.vod.itc.cn\\/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=\\/244\\/118\\/oggXgtJv24awoAcC0o1Cz5.mp4
\"],{\"out\":\"央视主播雷人囧事一箩筐[高清版].mp4\"}]}"
"{"jsonrpc":"2.0","id":"qwer","method":"aria2.addUri","params":[["
http://data.vod.itc.cn/?rb=1&amp;prot=1&amp;key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&amp;prod=flash&amp;pt=1&amp;new=/244/118/oggXgtJv24awoAcC0o1Cz5.mp4
"],{"out":"test"}]}"
http://data.vod.itc.cn/?rb=1&amp;prot=1&amp;key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&amp;prod=flash&amp;pt=1&amp;new=/244/118/oggXgtJv24awoAcC0o1Cz5.mp4
*/
function S2A2_xmlhttpRequest(dlurl, filename) {
  try {
    var oReq = new XMLHttpRequest();
    /*oReq.addEventListener("load", function(a1, a2, a3) {
      console.log('xhr.load: %s, %s, %s', a1, a2, a3);
    });*/

    jsonreq = {'jsonrpc':'2.0',
               'id':'qwer',
               'method':'aria2.addUri',
               'params': [[dlurl],{'out':filename}]}
    jsonreqstr = JSON.stringify(jsonreq);
    // open synchronously
    oReq.open("post","http://192.168.1.4:6800/jsonrpc",false);

    // send
    var res = oReq.send(jsonreqstr);
    //console.log('xhr result: %s', res);
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
        
        /*S2A2_xmlhttpRequest(safeUrl, 'test');*/
        
        
        browser.tabs.sendMessage(tab.id, safeUrl);
    }
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