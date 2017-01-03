const http = require('http')
const fs = require('fs')
const HttpDispatcher = require('httpdispatcher')
const library = require('./library')

const dispatcher = new HttpDispatcher()
dispatcher.setStatic('/root')
dispatcher.setStaticDirname(global.appRoot)
dispatcher.onGet('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(fs.readFileSync(global.appRoot + '/tmp/webserver.html'))
})
dispatcher.onGet('/library', (req, res) => {
  const falseout = {
    send(hook, data) {
      sendLibrary(data, res)
    }
  }
  library.get(falseout)
})
function sendLibrary(library, res) {
  res.writeHead(200, {'Content-Type': 'text/json'})
  res.end(JSON.stringify(library))
}

const PORT = 27777
const server = http.createServer((request, response) => {
  console.log(request.url)
  try {
    dispatcher.dispatch(request, response)
  } catch(err) {
    console.log(err)
  }
})

server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT)
})
