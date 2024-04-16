const express = require('express');
const multer = require('multer');
// const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors());

// Configure the fileUpload middleware
const upload = multer({
    storage: multer.diskStorage({
      destination: __dirname + '/uploads/',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  });
  
  app.post('/uploads', upload.single('file'), (req, res) => {
    if (req.file) {
      res.send({
        message: 'Uploaded succeeded',
        file: req.file.filename,
      });
    } else {
      res.status(400).send({ message: 'Upload failed' });
    }
  });
  
  app.get('/file/:filename', (req, res) => {
    res.sendFile(__dirname + '/uploads/${req.params.filename}');
  });
  
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(413).send({ message: err.message });
    } else {
      res.status(500).send({ message: err.message });
    }
  });

app.get('/downloads/:filename', (req, res) => {
  res.download(path.join(__dirname, 'downloads', req.params.filename));
});

// Return the application's default page if the path is unknown
app.use((_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});