chrome.runtime.onMessage.addListener(function(message, sender, reply) {
  console.log(message, sender, reply);
});
