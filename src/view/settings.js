const ipcRenderer = require('electron').ipcRenderer
const eSettings = require('electron-settings')
const $ = window.$ = window.jQuery = require('jquery')
require('bootstrap')

// The intent of this file is to be included in both visualizer and browser.
// This must be made slightly more modular.

ipcRenderer.on('open-settings', () => {
  const settings = eSettings.getSync()
  console.log(settings)
  $('#settings-visualizer-selected').val(settings.visualizer.selected)
  $('#settings-visualizer-openOnLaunch')[0].checked = settings.visualizer.openOnLaunch
  $('#settings-modal').modal('show')
})
$(() => {
  $('#settings-modal').on('hidden.bs.modal', () => {
    const settings = eSettings.getSync()

    // Visualizer
    const options = ['selected', 'openOnLaunch']
    for(const i in options) {
      const $input = $('#settings-visualizer-' + options[i])
      if($input.length > 0) {
        switch($input[0].type) {
          case 'checkbox':
            settings.visualizer[options[i]] = $input[0].checked
            break
          default:
            settings.visualizer[options[i]] = $input.val()
        }
      }
    }
    eSettings.set('visualizer', settings.visualizer)
  })
})
