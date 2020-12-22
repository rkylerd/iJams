const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./auth.js');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
let { parsed: { MONGODB_PWD = '', USERNAME = '', PORT = undefined } = {}} = require('dotenv').config();

if (!MONGODB_PWD) MONGODB_PWD = process.env.MONGODB_PWD;
if (!USERNAME) USERNAME = process.env.USERNAME;
if (!PORT) PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

// Logs Apache style server requests
app.use(morgan("common"));

// Middleware for basic security
app.use(helmet());

// CORS
const whitelist = ['https://rkylerd.github.io', 'http://localhost:8080'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
};
app.use(cors(corsOptions))

app.use(cookieParser());
// connect to the database
try {
  mongoose.connect(`mongodb+srv://${USERNAME}:${MONGODB_PWD}@ijams.8lbzh.mongodb.net/user?retryWrites=true&w=majority`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });
} catch (err) {
  console.log(err);
}

const playlist = require('./playlist.js');
app.use('/api/playlist', playlist);

const users = require('./users.js');
app.use('/api/users', users);

const stripe = require('./stripe'); 
app.use('/api/stripe', stripe);

const iTunesAPI = require('./search.js');
app.use('/api/search', iTunesAPI);

// const historyAPI = require('./history.js');
// app.use('/api/history', historyAPI);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));