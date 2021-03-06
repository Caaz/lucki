const fs = require('fs')
const {ipcMain} = require('electron')
const glob = require('glob')
const ID3 = require('id3-parser')
const settings = require('electron-settings')

const cache = global.appData + '/library_cache.json'

let library = false

ipcMain.on('library', (event, args) => {
  const command = args.shift()
  const output = event.sender
  switch(command) {
    case 'info':
      if(library[args[0]]) {
        getTags(library[args[0]].location, tag => {
          tag.location = library[args[0]].location
          output.send('info', tag)
        })
        event.returnValue = library[args[0]]
      }
      break
    case 'get':
      get(output)
      break
    case 'update':
      update(output)
      break
    default: console.out('Unexpected library command: ' + command)
  }
})
function get(out) {
  if(library) out.send('library', library)
  else load(out)
}
function load(out) {
  if(fs.existsSync(cache)) {
    console.log('Loading Library Cache')
    console.time('Loaded Library Cache')
    const data = fs.readFileSync(cache)
    library = JSON.parse(data)
    console.timeEnd('Loaded Library Cache')
    out.send('library', library)
    return true
  }
  return false
}
function save() {
  console.log('Saving Library')
  console.time('Saved Library')
  fs.writeFileSync(cache, JSON.stringify(library))
  console.timeEnd('Saved Library')
}
function update(out) {
  console.log('Updating Library')
  console.time('Updated Library')
  library = {}

  settings.get('library').then(librarySettings => {
    const globber = (librarySettings.subdirectories) ? '/**/*.mp3' : '/*.mp3'
    glob(librarySettings.directory + globber, (err, files) => {
      if(err) console.log(err)
      else parseFiles(files, out)
    })
  })
}
function getTags(file, callback) {
  const data = fs.readFileSync(file)
  ID3.parse(data).then(callback)
}
function parseFiles(files, out) {
  const file = files.shift()
  if(file) {
    // console.log("Reading "+file)
    getTags(file, tag => {
      delete tag.image
      delete tag.version
      tag.location = file
      library[hash(file)] = tag
      parseFiles(files, out)
    })
  } else {
    console.timeEnd('Updated Library')
    out.send('library', library)
    save(out)
  }
}

// * Calculate a 32 bit FNV-1a hash
// * Found here: https://gist.github.com/vaiorabbit/5657561
// * Modified
function hash(str) {
  let hval = 0x811c9dc5
  for (let i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }
  return ('0000000' + (hval >>> 0).toString(16)).substr(-8)
}

module.exports = {
  update,
  get
}
