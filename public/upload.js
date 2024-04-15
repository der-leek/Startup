window.onload = () => {
    document.querySelector('#username').innerHTML = localStorage.getItem('user_name');
}

const fileInput = document.getElementById('file_input');

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file_input', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully!');
    } else {
      console.error('Error uploading file:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function next() {
    // if a file is selected
        // call whisper.cpp
        // move to transcribe
    // else output error message
}