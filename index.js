const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

const express = require('express');

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Configure the fileUpload middleware
app.use(fileUpload({
    useTempFiles: true, // Use temporary files for uploads
    tempFileDir: '/tmp/', // Specify the temporary file directory
}));

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const uploadedFile = req.files.file_input;
  
    // Move the uploaded file to a desired location on the server
    uploadedFile.mv(`./public/uploads/${uploadedFile.name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      res.send('File uploaded successfully!');
    });
});
  

// Endpoint for receiving audio file (POST)

// Endpoint for downloading text file (GET)

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
