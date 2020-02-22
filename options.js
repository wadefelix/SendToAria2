var browser=chrome;
function saveOptions(e) {
  browser.storage.local.set({
    aria2server: document.querySelector("#aria2server").value
  });
  browser.storage.local.set({
    aria2secret: document.querySelector("#aria2secret").value
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.local.get('aria2server',(res) => {
    document.querySelector("#aria2server").value = res.aria2server || '';
  });
  browser.storage.local.get('aria2secret',(res) => {
    document.querySelector("#aria2secret").value = res.aria2secret || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
