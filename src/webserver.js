const http = require('http')
const fs = require('fs')
const HttpDispatcher = require('httpdispatcher')

const dispatcher = new HttpDispatcher()
dispatcher.setStatic('/tmp')
dispatcher.setStaticDirname(global.appRoot + '/tmp')
dispatcher.onGet('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(fs.readFileSync(global.appRoot + '/tmp/webserver.html'))
})

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
