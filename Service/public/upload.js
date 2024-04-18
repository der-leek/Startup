window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');

    let login_logout = document.querySelector('#login_logout');
    login_logout.innerHTML = '<a>logout</a>';
    login_logout.addEventListener('click', logout);
    login_logout.style.cursor = 'pointer';
    login_logout.style.color = 'rgb(220, 220, 220)';
};

async function upload_file(file_input) {
    const file = file_input.files[0];

    const uploading = document.getElementById('drop_button');
    uploading.textContent = 'uploading file...';
    typewriter(uploading, uploading.textContent);

    if (!file) {
    console.error('No file selected');
    return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const successMessage = 'file uploaded successfully';
        console.log(successMessage);
        uploading.textContent = successMessage;
        setTimeout(() => typewriter(uploading, successMessage), 1500);
    } else {
        const failureMessage = 'file upload failed';
        console.error('File upload failed');
        uploading.textContent = failureMessage;
        setTimeout(() => typewriter(uploading, failureMessage), 1500);
    }
    
}

function logout() {
    localStorage.removeItem('user_name');
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
    }).then(() => (window.location.href = '/'));
  }


function message(text) {
    const message = document.createElement('p');
    message.textContent = text;

    return message;
}

function typewriter(element, text, index=0) {    
    if (index < text.length) {
        element.innerHTML = text.slice(0, index);
        index++;
        
        let random_delay = Math.random() + .8 * text.length; // Base delay
        if (Math.random() < 0.5) { // 10% chance of a pause
            random_delay += Math.random() * 250; // Add up to 0.25 seconds extra
        }
        setTimeout(() => typewriter(element, text, index), random_delay);
    } else {
        element.innerHTML = text.slice(0, index);
    }
}