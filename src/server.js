const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const getPort = require('get-port');
const ws = require('ws');

module.exports = async (input, output, options) => {
  const defaultOptions = Object.assign({
    port: 5151,
    filter: ['**/*.css'],
    Nc: false,
    cb: null
  }, options);

  const port = await getPort({ port: defaultOptions.port });

  // the http server is to handle requests for the client.js file
  const httpServer = http.createServer((req, res) => {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
      'Access-Control-Allow-Methods': 'OPTIONS, GET',
      ' Access-Control-Allow-Private-Network': true,
      'Access-Control-Max-Age': 2592000, // 30 days
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url == '/server.js') {
      res.writeHead(200, { 'Content-Type': ' application/javascript' });
      res.write(fs.readFileSync(path.join(__dirname, '/client.js'), 'utf8').replace(/\[port\]/g, port));
      res.end();
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  let gulp = null;
  // the websocket server is to handle the communication between the client and the server
  const socketServer = new ws.WebSocketServer({ server: httpServer });
  socketServer.on('connection', async (ws) => {
    if (!gulp) {
      gulp = await require('./watcher')(
        input,
        output,
        (message) => {
          socketServer.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
        }
        ,
        defaultOptions.filter,
        defaultOptions.Nc
      );
    }

    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);
  });

  socketServer.on('close', async () => {
    if (watcher) await watcher.close();
    clearInterval(heartbeatCheck);
  });

  const heartbeatCheck = setInterval(function ping() {
    socketServer.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        console.warn('No heartbeat from client. Terminating connection');
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  httpServer.listen(port, () => {
    if (defaultOptions.cb) defaultOptions.cb(defaultOptions);
  })
};