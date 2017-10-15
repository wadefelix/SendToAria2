
function S2A2_getfilename(dlurl) {
    var filename = window.top.prompt("[Send To Aria2] Save As Filename","");
    //if (filename.length==0) return;
    browser.runtime.sendMessage({"url": dlurl, "filename":filename});
}

browser.runtime.onMessage.addListener(S2A2_getfilename);

