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

function save() {
    localStorage.setItem("transcription", document.querySelector('#output_placeholder').textContent);
}

window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
    let output_text_element = document.querySelector('#output_placeholder');
    let output_content = output_text_element.textContent;
    output_text_element.textContent = "";
    setTimeout(() => typewriter(output_text_element, output_content), 250) 
}
