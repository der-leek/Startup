function typewriter(element, text, index=18) {
  if (index < text.length) {
      element.innerHTML = text.slice(0, index);
      index++;
      
      let random_delay = Math.random() * 10 + 50; // Base delay
      if (Math.random() < 0.25) { // 25% chance of a pause
          random_delay += Math.random() * 300; // Add up to 0.3 seconds extra
      }

      setTimeout(() => typewriter(element, text, index), random_delay);
  } else {
      element.innerHTML = text.slice(0, index);
  }
}

async function login() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
  });
  
  let welcome = document.getElementById("welcome");
  
  if (username != "" && password.value != "") {
    if (response.ok) {
      localStorage.setItem("user_name", username);
      text = "welcome to whisper, " + username;
      typewriter(welcome, text);
      document.body.classList.add('fade-out'); 
      setTimeout(() => window.location.href = "upload.html", 1000)
    } else {
      text = await response.json().then(data => {
        return data.msg;
      });
      typewriter(welcome, text, 4);
    }
  }
}

function logout() {
  localStorage.removeItem('user_name');
  fetch(`/api/auth/logout`, {
    method: 'DELETE',
  }).then(() => (window.location.href = '/'));
}