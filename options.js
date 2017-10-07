function saveOptions(e) {
  browser.storage.local.set({
    aria2server: document.querySelector("#aria2server").value
  });
  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.local.get('aria2server');
  gettingItem.then((res) => {
    document.querySelector("#aria2server").value = res.aria2server || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
