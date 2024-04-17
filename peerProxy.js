const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

function peerProxy(httpServer) {
  // Create a WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // Store the current connection
  let currentConnection = null;

  // Handle WebSocket connection
  wss.on('connection', (ws) => {
    // If there's an existing connection, terminate it
    if (currentConnection) {
      currentConnection.ws.terminate();
    }

    // Create a new connection
    const newConnection = {
      id: uuidv4(),
      alive: true,
      ws: ws,
    };
    currentConnection = newConnection;

    // Handle message forwarding
    // ws.on('message', (data) => {
    //   if (currentConnection) {
    //     currentConnection.ws.send(data);
    //   }
    // });

    ws.on('message', (message) => {
      message = Buffer.from(message).toString('utf8');
      if (message === 'get_transcript') {
        // Read the contents of the output.txt file
        fs.readFile('./downloads/output.txt', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading output.txt:', err);
            return;
          }
  
          // Send the transcript text back to the client over the WebSocket connection
          ws.send(data);
        });
      }
    });

    // Handle connection close
    ws.on('close', () => {
      currentConnection = null;
    });

    // Handle pong messages
    ws.on('pong', () => {
      if (currentConnection) {
        currentConnection.alive = true;
      }
    });
  });

  // Keep the active connection alive
  setInterval(() => {
    if (currentConnection) {
      // Terminate the connection if it didn't respond to the ping last time
      if (!currentConnection.alive) {
        currentConnection.ws.terminate();
        currentConnection = null;
      } else {
        currentConnection.alive = false;
        currentConnection.ws.ping();
      }
    }
  }, 10000);
}

module.exports = { peerProxy };