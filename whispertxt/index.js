function login() {
    const user_id = document.querySelector("#username");
    localStorage.setItem("user_name", user_id.value);
    const password = document.querySelector("#password");

    let welcome = document.getElementById("welcome");
    
    text = welcome.textContent + ", " + user_id.value;
    typewriter(welcome, text);
    if (user_id.value != "" && password.value != "") {
        // window.location.href = "upload.html";
    }
  }