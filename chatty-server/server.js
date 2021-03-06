// server.js

const express = require('express');
const WebSockets = require('ws')
const SocketServer = WebSockets.Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

   // Broadcast to all.

wss.on('connection', function connection(ws) {
  ws.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSockets.OPEN) {
        client.send(data);
      }
    });
  };

   console.log('Client connected');

  ws.on('message', function incoming(data) {

    let newComm = JSON.parse(data);

    if (newComm.type === "postMessage") {

      newComm.type = "incomingMessage"

      ws.broadcast(JSON.stringify(newComm));

    } else {

      newComm.type = "incomingNotification"

      ws.broadcast(JSON.stringify(newComm));
    }


    const onlineUsers = {
      type: "userCount",
      num: wss.clients.size,
    }

    ws.broadcast(JSON.stringify(onlineUsers));


  });

   ws.on('close', () => console.log('Client disconnected'));

});
