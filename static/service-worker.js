// TODO: Register main tab

// TODO: Register sub-frames

// TODO: Pass messages between tab & frames
chrome.runtime.onMessage.addListener((args, sender) => {
  chrome.tabs.sendMessage(sender.tab.id, args)
})