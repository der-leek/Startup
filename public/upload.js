window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
}

function next() {
    // if a file is selected
        // call whisper.cpp
        // move to transcribe
    // else output error message
}