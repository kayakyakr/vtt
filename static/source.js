(async function() {
  if (window.self !== window.top) {
    // TODO: Watch for tooltips
    // on mouse enter
    // on mouse leave

    function ancestorContains(node, className) {
      return node.classList.contains(className)
        || (!!node.parentElement && ancestorContains(node.parentElement, className))
    }

    function findFigure(node) {
      return node.tagName === "FIGURE" ? node : !!node.parentElement && findFigure(node.parentElement)
    }

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

      // Watch for onclick for maps
      if (ancestorContains(e.target, 'compendium-image')) {
        e.preventDefault()
        e.stopPropagation()
        const figure = findFigure(e.target)

        chrome.runtime.sendMessage({
          message: "map-selected",
          url: figure.querySelector('.compendium-image-center').href,
          playerUrl: figure.querySelector('figcaption a')?.href,
          name: figure.querySelector('figcaption').textContent.replace("View Player Version", "").trim()
        })
      }
    })



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