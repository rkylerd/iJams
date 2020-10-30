const express = require("express");
const router = express.Router();
const request = require("request");


const itunesApi = "https://itunes.apple.com/",
      searchEndpoint = "search?term=", 
      lookupEndpoint = "lookup?id=",
      songEntity = "&entity=song",
      albumEntity = "&entity=album",
      limit = "&limit=200";

router.get('/song/:q', function(req,res) {
      console.log(req.params.q);
      request(`${itunesApi}${searchEndpoint}${req.params.q}${songEntity}${limit}`).pipe(res);
  
      // request(`${itunesApi}${searchEndpoint}${req.params.q}${songEntity}${limit}`).pipe(res);
});

router.get('/mvideo/:q', function(req,res) {
      request(`${itunesApi}${searchEndpoint}${req.params.q}&entity=musicVideo`).pipe(res);
  
      // request(`${itunesApi}${searchEndpoint}${req.params.id}${songEntity}${limit}`).pipe(res);
});

router.get('/album/:id', async (req,res) => {
      request(`${itunesApi}${lookupEndpoint}${req.params.id}${songEntity}${limit}`).pipe(res);
});

router.get('/artist/:id', async (req,res) => {
      console.log("artist search: ", itunesApi + lookupEndpoint + req.params.id + songEntity);
      request(`${itunesApi}${lookupEndpoint}${req.params.id}${songEntity}${limit}`).pipe(res);
});

router.get('/artistalbums/:id', async (req,res) => {
      request(`${itunesApi}${lookupEndpoint}${req.params.id}${albumEntity}`).pipe(res);
});

// router.get('/', function(req,res) {
//     console.log("req.params ", req);
//   res.send("Made it to the search file.");
  
// });
module.exports = router;