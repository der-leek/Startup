window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
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