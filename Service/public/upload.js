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
        console.log('File uploaded successfully');
    } else {
        console.error('File upload failed');
    }
    
}

function logout() {
    localStorage.removeItem('user_name');
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
    }).then(() => (window.location.href = '/'));
  }
// function next() {
//     // if a file is selected
//         // call whisper.cpp
//         // move to transcribe
//     // else output error message
// }

// Check if the file is an audio file
    //   const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/mpeg', 'audio/mpga', 'audio/m4a', 'audio/wav', 'audio/webm'];
    //   if (!allowedTypes.includes(file.type)) {
    //     console.error('Invalid file type. Please select an audio file.');
    //     return;
    //   }