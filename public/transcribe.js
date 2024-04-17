let socket = null;

function createWebSocketConnection() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
}

function handleWebSocketEvents() {
  socket.onopen = () => {
    console.log('WebSocket connection established');
    sendTranscriptOverWebSocket();
  };

  socket.onmessage = (event) => {
    // Handle message received from the server
    const transcript = event.data;
    displayTranscript(transcript);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    socket = null;
    handleWebSocketReconnection();
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    displayWebSocketErrorMessage();
  };
}

function handleWebSocketReconnection() {
  // Try to re-establish the WebSocket connection after a delay
  setTimeout(createWebSocketConnection, 5000);
}

function displayWebSocketErrorMessage() {
    const errorMessage = 'Unable to establish WebSocket connection. Please try again later.';
    displayErrorMessage(errorMessage);
}
  
function displayErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function sendTranscriptOverWebSocket() {
    // Check if the WebSocket connection is established
    if (socket) {
      // Send a request to the server to get the contents of output.txt
      socket.send('get_transcript');
    } else {
      console.error('WebSocket connection not established');
    }
}
  
function displayTranscript(transcriptText) {
    // Update the DOM with the received transcript text
    const output = document.getElementById('output');
    let output_content = transcriptText;
    setTimeout(() => typewriter(output, output_content, 0), 500) 
}

function initWebSocket() {
    createWebSocketConnection();
    handleWebSocketEvents();
}

window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
    let output_text_element = document.querySelector('#output');
    let output_content = 'transcribing...';
    setTimeout(() => typewriter(output_text_element, output_content, 0), 500) 
 
    setupLogoutButton();
    initWebSocket();
};


function save() {
    fetch('/api/downloads/output.txt')
        .then(response => {
            if (response.ok) {
                return response.blob(); // Get the file as a blob
            } else {
                throw new Error('Error downloading file');
            }
            })
        .then(blob => {
            // Create a temporary link to initiate the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.txt'; // Set the desired file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            })
        .catch(error => {
            console.error('Error downloading file:', error);
    });
}

function setupLogoutButton() {
  let login_logout = document.querySelector('#login_logout');
  login_logout.innerHTML = '<a>logout</a>';
  login_logout.addEventListener('click', logout);
  login_logout.style.cursor = 'pointer';
  login_logout.style.color = 'rgb(220, 220, 220)';
}

function logout() {
  localStorage.removeItem('user_name');
  fetch(`/api/auth/logout`, {
    method: 'DELETE',
  }).then(() => {
    // Close the WebSocket connection
    if (socket) {
      socket.close();
    }
    window.location.href = '/';
  });
}

function typewriter(element, text, index=18) {
    if (index < text.length) {
        element.innerHTML = text.slice(0, index);
        index++;
        
        let random_delay = Math.random() + .15*text.length; // Base delay
        if (Math.random() < 0.1) { // 10% chance of a pause
            random_delay += Math.random() * 250; // Add up to 0.25 seconds extra
        }
        setTimeout(() => typewriter(element, text, index), random_delay);
    } else {
        element.innerHTML = text.slice(0, index);
    }
}

function chuckNorris() {
    fetch('https://api.chucknorris.io/jokes/random?category=dev')
        .then(response => response.json())
        .then(data => {
            if (data.value) output_content = data.value;
        })
        .catch(error => {
            console.error('Error fetching joke:', error);
        });
}