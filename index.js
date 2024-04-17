const port = process.argv.length > 2 ? process.argv[2] : 4000;

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');

const app = express();
const authCookieName = 'token';

// JSON body parsing using built-in middleware
app.use(express.json());
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static(path.join(__dirname, 'public')));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Enable CORS
app.use(cors());

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.email, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await DB.getUser(req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
          setAuthCookie(res, user.token);
          res.send({ id: user._id });
          return;
      } else {
          res.status(401).send({ msg: 'your username or password is incorrect' });
          return;
      }
    }
    res.status(401).send({ msg: 'you must first join whisper to use it' });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: 'Internal error' });
  }
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

// Configure the fileUpload middleware
const upload = multer({
  storage: multer.diskStorage({
    destination: __dirname + '/uploads/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

secureApiRouter.post('/uploads', upload.single('file'), (req, res) => {
if (req.file) {
  res.send({
    message: 'Uploaded succeeded',
    file: req.file.filename,
  });
} else {
  res.status(400).send({ message: 'Upload failed' });
}
});

secureApiRouter.get('/file/:filename', (req, res) => {
res.sendFile(__dirname + '/uploads/${req.params.filename}');
});

secureApiRouter.use((err, req, res, next) => {
if (err instanceof multer.MulterError) {
  res.status(413).send({ message: err.message });
} else {
  res.status(500).send({ message: err.message });
}
});

secureApiRouter.get('/downloads/:filename', (req, res) => {
res.download(path.join(__dirname, 'downloads', req.params.filename));
});

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Return the application's default page if the path is unknown
app.use((_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});