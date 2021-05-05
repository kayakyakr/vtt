(async function() {
  if (window.self !== window.top) {
    // TODO: Watch for onclick for monsters

    // TODO: Watch for onclick for maps

    // TODO: Watch for source chapter/scroll
    chrome.storage.sync.get(["sourceUrl"], ({ sourceUrl }) => {
      if ( location.pathname !== sourceUrl ) {
        chrome.storage.sync.set({ sourceUrl: location.pathname })
      }
    })
  }
})()