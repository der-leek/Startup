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

window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
    let output_text_element = document.querySelector('#output_placeholder');
    let output_content = output_text_element.textContent;
    fetch('https://api.chucknorris.io/jokes/random?category=dev')
        .then(response => response.json())
        .then(data => {
            if (data.value) output_content = data.value;
        })
        .catch(error => {
            console.error('Error fetching joke:', error);
        });
    
    output_text_element.textContent = "";
    setTimeout(() => typewriter(output_text_element, output_content), 250) 
}
