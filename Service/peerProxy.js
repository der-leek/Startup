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
        processAudio(ws);
      } else if (message === 'delete_transcript') {
        runBashScript('./clear_downloads.sh');
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

async function processAudio(ws) {
  // Send transcription to user once output.txt is created
  await runBashScript('./convert.sh');
  await runBashScript('./transcribe.sh');
  const downloadPath = './downloads';
  const downloadFile = `${downloadPath}/output.txt`;
  await read_output_file(downloadFile, ws);

  const deleteScript = './clear_uploads.sh';
  await runBashScript(deleteScript);
}

async function runBashScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(scriptPath, (error, stdout, stderr) => {
      if (error) {
        reject(error); // Reject the promise with the error
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function read_output_file(downloadFile, ws) {
  // Read the contents of the output.txt file
  await fs.readFile(downloadFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading output.txt:', err);
      return;
    }
    // Send the transcript text back to the client over the WebSocket connection
    ws.send(data);
  });
}

module.exports = { peerProxy };