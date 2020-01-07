const express = require("express");
const router = express.Router();
const request = require("request");


var itunes = "https://itunes.apple.com/";
var search = "search?term=";
var lookup = "lookup?id=";
var typeSong = "&entity=song";
var typeAlbum = "&entity=album";

router.get('/:id', function(req,res) {
      console.log("req.params ", req.params);
      request(itunes + search + req.params.id + typeSong).pipe(res);
});

router.get('/album/:id', async (req,res) => {
   request(itunes + lookup + req.params.id + typeSong).pipe(res);
});

router.get('/artist/:id', async (req,res) => {
      console.log("artist search: ", itunes + lookup + req.params.id + typeSong);
      request(itunes + lookup + req.params.id + typeSong).pipe(res);
});

router.get('/artistalbums/:id', async (req,res) => {
      request(itunes + lookup + req.params.id + typeAlbum).pipe(res);
});

// router.get('/', function(req,res) {
//     console.log("req.params ", req);
//   res.send("Made it to the search file.");
  
// });
module.exports = router;