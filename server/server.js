const express = require('express');
const bodyParser = require("body-parser");
const auth = require("./auth.js");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
const corsOptions = {
  origin: 'https://rkylerd.github.io/' // some legacy browsers (IE11, various SmartTVs) choke on 204
}
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

app.listen(3000, () => console.log('Server listening on port 3000!'));