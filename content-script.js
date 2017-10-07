
function S2A2_xmlhttpRequest(dlurl) {
  try {
  
    var filename = window.top.prompt("Send To Aria2","另存为文件名");
    
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

browser.runtime.onMessage.addListener(S2A2_xmlhttpRequest);
//window.addEventListener("contextmenu", notifyClnuExtensionBackgroudjs);

