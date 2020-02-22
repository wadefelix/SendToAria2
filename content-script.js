
function S2A2_getfilename(dlurl) {
    var filename = window.top.prompt("[Send To Aria2] Save As Filename","");
    var sendto = true;
    if (filename==null || filename.length==0) {
        var sendtowithblank = window.top.prompt("Send to Aria2 Directly? \"Cancel\" to cancel this Action.");
        if (!sendtowithblank) sendto = false;
    }
    if (sendto) {
        browser.runtime.sendMessage({"url": dlurl, "filename":filename});
    }
}

chrome.runtime.onMessage.addListener(S2A2_getfilename);

