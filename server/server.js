const express = require('express');
const bodyParser = require("body-parser");
// const auth = require("./auth.js");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const whitelist = ['https://rkylerd.github.io', 'http://localhost:8080'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
};
app.use(cors(corsOptions))

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const mongoose = require('mongoose');

// connect to the database
// mongoose.connect('mongodb://localhost:27017/library', {
//   useNewUrlParser: true
// });

// const library = require("./library.js");
// app.use("/api/library", library);

// const users = require("./users.js");
// app.use("/api/users", users);

const stripe = require("./stripe"); 
app.use("/api/stripe", stripe);

const iTunesAPI = require("./search.js");
app.use("/api/search", iTunesAPI);

// const historyAPI = require("./history.js");
// app.use("/api/history", historyAPI);
const port = process.env.PORT || (process.env.NODE_ENV === 'local' ? 3000 : 80);
app.listen(port, () => console.log(`Server listening on port ${port}!`));