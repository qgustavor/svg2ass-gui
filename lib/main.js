const dataInput = document.getElementById('dataInput')
const dataOutput = document.getElementById('dataOutput')
const convertBtn = document.getElementById('convertBtn')
const advancedBtn = document.getElementById('advancedBtn')
const openFileBtn = document.getElementById('openFile')
const openFileMsg = document.getElementById('openFileMsg')
const advancedPanel = document.getElementById('advancedPanel')
const startTime = document.getElementById('startTime')
const endTime = document.getElementById('endTime')
const actorEl = document.getElementById('actor')
const styleEl = document.getElementById('style')
const layerEl = document.getElementById('layer')
const epsilonEl = document.getElementById('epsilon')
const precisionEl = document.getElementById('precision')
const arclineEl = document.getElementById('arcline')
const svgoEl = document.getElementById('svgo')
const scaleEl = document.getElementById('scale')
const messages = JSON.parse(document.getElementById('messages').textContent)
const languagesEl = document.getElementsByClassName('languages')[0]

const getSettings = precision => [
  {
    name: 'convertPathData',
    active: precision !== -1,
    params: {
      applyTransforms: true,
      applyTransformsStroked: true,
      makeArcs: {
        threshold: 2.5,
        tolerance: 0.5
      },
      straightCurves: true,
      lineShorthands: true,
      // Needs to be disabled
      curveSmoothShorthands: false,
      floatPrecision: precision,
      transformPrecision: 5,
      removeUseless: true,
      collapseRepeated: true,
      utilizeAbsolute: true,
      leadingZero: true,
      negativeExtraSpace: true,
      noSpaceAfterFlags: false,
      forceAbsolutePath: false
    }
  },
  {
    name: 'cleanupNumericValues',
    active: precision !== -1,
    params: { floatPrecision: precision }
  },
  {
    name: 'cleanupListOfValues',
    active: precision !== -1,
    params: { floatPrecision: precision }
  },
  // Required for compatibility
  { name: 'convertStyleToAttrs', active: true }
]
const svgoSettings = [
  // Just compatibility settings
  getSettings(-1),
  // Small compression
  getSettings(3),
  // Medium compression
  getSettings(1),
  // Strong compression
  getSettings(0)
]

let clickWillCopy = false
async function runProgram (data) {
  const svgoLevel = Number(svgoEl.value)
  if (svgoLevel) {
    const svgo = await import('./svgo.browser.js')
    const settings = {
      plugins: svgo.extendDefaultPlugins(svgoSettings[svgoLevel - 1])
    }
    const result = svgo.optimize(data, settings)
    // Only replace data if svgo returns something
    if (result.data) data = result.data
  }
  const worker = new window.Worker('lib/worker.js')
  worker.addEventListener('message', evt => {
    const data = evt.data
    if (data.status === 0) {
      dataOutput.value = evt.data.stdout.join('\r\n')
      clickWillCopy = true
    } else {
      dataOutput.value = evt.data.stderr.join('\r\n')
      dataOutput.parentNode.setAttribute('data-pm-error', messages.convertionError)
    }
  })
  dataOutput.parentNode.removeAttribute('data-pm-error', '')
  const argv = [
    '-e', epsilonEl.value,
    '-f', precisionEl.value,
    '-L', layerEl.value,
    '-S', startTime.value,
    '-E', endTime.value,
    '-A', actorEl.value,
    '-T', styleEl.value,
    '-z', arclineEl.value,
    '-s', scaleEl.value
  ]
  worker.postMessage({ data, argv })
}

function runExample () {
  // The example is a SVG outlined version of the original Brazilian Portuguese
  // translation of the text in the first Kimokoi episode at 12:19.
  window.fetch('lib/example.svg').then(e => e.text()).then(e => {
    startTime.value = '0:12:19.00'
    endTime.value = '0:12:21.26'
    dataInput.value = e
    runProgram(e)
  })
}

convertBtn.addEventListener('click', evt => {
  evt.preventDefault()
  const data = dataInput.value
  dataOutput.parentNode.removeAttribute('data-pm-success')
  if (data) {
    runProgram(data)
  } else {
    // Loads an example if the button is clicked without any data
    runExample()
  }
})

dataOutput.addEventListener('focus', evt => {
  if (!clickWillCopy) return
  clickWillCopy = false
  evt.preventDefault()
  dataOutput.selectionStart = 0
  dataOutput.selectionEnd = dataOutput.value.length
  const copyResult = document.execCommand('copy')
  if (copyResult) {
    dataOutput.parentNode.setAttribute('data-pm-success', messages.copied)
  } else {
    dataOutput.parentNode.setAttribute('data-pm-success', messages.copy)
  }
})

advancedBtn.addEventListener('click', evt => {
  evt.preventDefault()
  advancedPanel.classList.toggle('pm-is-hidden')
})

let lastOpenFileMsg = openFileMsg.textContent
openFileBtn.addEventListener('change', evt => {
  evt.preventDefault()
  const file = openFileBtn.files[0]
  if (!file) return
  if (leaveTimeout) clearTimeout(leaveTimeout)
  openFileMsg.textContent = lastOpenFileMsg = file.name
  const reader = new window.Response(file)
  reader.text().then(e => {
    dataInput.value = e
    runProgram(e)
  })
})

document.documentElement.addEventListener('dragover', evt => {
  evt.preventDefault()
  openFileMsg.textContent = messages.dropHere
  if (leaveTimeout) clearTimeout(leaveTimeout)
})

let leaveTimeout
document.documentElement.addEventListener('dragleave', evt => {
  evt.preventDefault()
  if (leaveTimeout) clearTimeout(leaveTimeout)
  leaveTimeout = setTimeout(resetOpenFileMsg, 250)
})

function resetOpenFileMsg () {
  leaveTimeout = null
  openFileMsg.textContent = lastOpenFileMsg
}

document.documentElement.addEventListener('paste', pasteHandler)

function pasteHandler (evt) {
  const file = evt.clipboardData.files[0]
  if (!file) return
  openFileMsg.textContent = file.name
  const reader = new window.Response(file)
  reader.text().then(e => {
    dataInput.value = e
    runProgram(e)
  })
}

window.fetch('lib/languages.html').then(e => e.text()).then(e => {
  languagesEl.innerHTML = e
  const currentLanguage = document.documentElement.lang
  for (const anchor of languagesEl.children) {
    if (anchor.dataset.lang === currentLanguage) {
      anchor.remove()
    }
  }
})
