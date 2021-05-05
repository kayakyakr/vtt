import { readdir, rename } from 'fs/promises'

const START_REGEXP = /start-[^.]*\.js/

async function renameStart() {
  try {
    const files = await readdir("./build/app")
    const startScript = files.find(f => START_REGEXP.test(f))
    if (startScript) await rename(`./build/app/${startScript}`, './build/app/start.js')
  } catch(e) {
    console.error(e)
  }
}

renameStart()
