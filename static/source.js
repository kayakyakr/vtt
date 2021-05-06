(async function() {
  if (window.self !== window.top) {
    // TODO: Watch for tooltips
    // on mouse enter
    // on mouse leave

    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains("tooltip-hover")) {
        // Block onclick for out-of-source links
        e.preventDefault()
        e.stopPropagation()

        // Watch for onclick for monsters
        if (e.target.classList.contains("monster-tooltip")) {
          chrome.runtime.sendMessage({
            message: "monster-selected",
            tooltip: e.target.dataset["tooltipHref"],
            name: e.target.textContent
          })
        }
      }
    })


    // TODO: Watch for onclick for maps

    // Watch for source chapter/scroll
    chrome.storage.sync.get(["sourceUrl"], ({ sourceUrl }) => {
      if (location.pathname !== sourceUrl) {
        chrome.storage.sync.set({ sourceUrl: location.pathname })
      }
    })

    document.querySelectorAll(".j-collapsible").forEach((n) => {
      if (n.innerText.startsWith("Sourcebooks")) {
        n.querySelector(".j-collapsible__trigger")?.classList.add('ddb-collapsible__header--closed')
        n.querySelector(".j-collapsible__content")?.classList.add('ddb-collapsible__content--closed')
      }
    })
  }
})()