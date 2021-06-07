/* eslint-env worker */
// This worker is just a small wrapper around the Emscripten output
self.addEventListener('message', runProgram)

function runProgram (evt) {
  const input = evt.data
  const Module = self.Module = {}
  Module.arguments = input.argv.concat('file.svg')

  const stderr = []
  const stdout = []
  Module.printErr = e => stderr.push(e)
  Module.print = e => stdout.push(e)

  Module.preRun = () => {
    Module.FS_createDataFile('/', 'file.svg', input.data, true, true)
  }

  Module.onExit = status => {
    self.postMessage({ status, stderr, stdout })
    self.close()
  }

  importScripts('svg2ass.js')
  // eslint-disable-next-line no-undef
  noExitRuntime = false
}
