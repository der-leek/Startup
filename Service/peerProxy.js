const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { exec } = require('child_process');

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

    ws.on('message', (message) => {
      message = Buffer.from(message).toString('utf8');
      if (message === 'get_transcript') {
        

        const audioFile = fs.readdirSync('./uploads')[0];

        const scriptPath = './whisper.sh';
        
        exec(scriptPath, (error, stdout, stderr) => {
          if (error) {
            console.error('Error running script:', error);
            return;
          }
        
          // console.log('stdout:', stdout);
          // console.log('stderr:', stderr);
        });

        const downloadPath = './downloads';
        const downloadFile = `${downloadPath}/output.txt`;

        fs.watch(downloadPath, (eventType, filename) => {
          if (eventType === 'rename') { // Check for file creation (rename event)
            console.log(`File created: ${filename}`);
            
            // Read the contents of the output.txt file
            fs.readFile(downloadFile, 'utf8', (err, data) => {
              if (err) {
                console.error('Error reading output.txt:', err);
                return;
              }

            // Send the transcript text back to the client over the WebSocket connection
            ws.send(data);
          });
          }
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