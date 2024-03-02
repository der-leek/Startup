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
        setTimeout(() => window.location.href = "upload.html", 500)
    }
}

function login() {
    const user_id = document.querySelector("#username");
    localStorage.setItem("user_name", user_id.value);
    const password = document.querySelector("#password");

    let welcome = document.getElementById("welcome");
    
    if (user_id.value != "" && password.value != "") {
        text = welcome.textContent + ", " + user_id.value;
        typewriter(welcome, text);
    }
  }