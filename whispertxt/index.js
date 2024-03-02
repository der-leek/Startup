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
        document.body.classList.add('fade-out'); 
        setTimeout(() => window.location.href = "upload.html", 1000)
    }
}

function login() {
    localStorage.setItem("user_name", document.querySelector("#username").value);
    const username = localStorage.getItem("user_name")
    const password = document.querySelector("#password");

    let welcome = document.getElementById("welcome");
    
    if (username != "" && password.value != "") {
        text = welcome.textContent + ", " + username;
        typewriter(welcome, text);
    }
  }