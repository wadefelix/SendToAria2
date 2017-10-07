
function S2A2_getfilename(dlurl) {
    var filename = window.top.prompt("Send To Aria2 另存为文件名","");
    if (filename.length==0) return;
    browser.runtime.sendMessage({"url": dlurl, "filename":filename});
}

browser.runtime.onMessage.addListener(S2A2_getfilename);

