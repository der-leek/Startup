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