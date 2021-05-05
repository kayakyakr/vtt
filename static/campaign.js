console.info("Campaign VTT Initialized")

const button = document.createElement("a")
button.href = "#"
button.className = "button-alt button-alt-default"
const span = document.createElement("span")
span.className = "label"
span.innerText = "Launch VTT"
button.appendChild(span)

const linkBar = document.querySelector(".page-header .more-links__links")
if (linkBar) linkBar.appendChild(button)

let loadedVTT = false

button.addEventListener('click', async (e) => {
  e.preventDefault()
  console.info("Launching VTT Mode")
  document.body.classList.add("VTT")
  if (!loadedVTT) {
    const startPath = chrome.runtime.getURL("app/start.js")
    const { start } = await import(startPath)
    const svelte = document.createElement("div")
    svelte.id = "svelte"
    start({
      target: svelte,
      paths: { base: "", assets: chrome.runtime.getURL("app/") },
      session: {},
      host: location.host,
      route: true,
      spa: true,
      hydrate: null
    });
    document.body.append(svelte)
    loadedVTT = true
  }
})