const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const request = require("request");

//
// Songs
//

const librarySchema = new mongoose.Schema({
  trackName: String,
  previewUrl: String,
  collectionName: String,
  artistId: String,
  collectionId: String,
  trackPrice: String, 
  artistName: String,
  trackExplicitness: String,
  artworkUrl60: String,
  artworkUrl100: String,
  className: String,
  trackId: String,
  trackTimeMillis: String,
  index: Number,
  username: String
});

const Song = mongoose.model('Song', librarySchema);

router.get('/:id', async (req, res) => {
    console.log("router.get playlist for: ", req.params.id);
  try {
    let songs = await Song.find({username: req.params.id.toString()});
    return res.send(songs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
    console.log("router.post('/')", req.body.song);
    try {
        let playlistSong = await Song.findOne({
                username: req.body.song.username,
                trackId: req.body.song.trackId
              });
        if (playlistSong != null) {
          return res.status(400).send("That song is already in your playlist.");
        }
  
        const song = new Song({
              username: req.body.song.username,
              trackName: req.body.song.trackName,
              previewUrl: req.body.song.previewUrl,
              collectionName: req.body.song.collectionName,
              collectionId: req.body.song.collectionId,
              artistId: req.body.song.artistId,
              trackPrice: req.body.song.trackPrice, 
              artistName: req.body.song.artistName,
              trackExplicitness: req.body.song.trackExplicitness,
              collectionExplicitness: req.body.song.collectionExplicitness,
              artworkUrl60: req.body.song.artworkUrl60,
              artworkUrl100: req.body.song.artworkUrl100,
              className: req.body.song.className,
              trackId: req.body.song.trackId,
              trackTimeMillis: req.body.song.trackTimeMillis
        });

        await song.save();
        return res.status(200).send(song);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    let params = req.params.id.split(".");
    console.log("delete parameters: ", params);
  try {
    await Song.deleteOne({
      username: params[0],
      trackId: params[1]
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

/* */
router.put('/:id', async (req, res) => {
    let data = req.body.song;
    console.log("song", data);
    try {
          let song = await Song.findOne({
            username: req.params.id,
            trackId: req.body.song.trackId
          });

          song.index = data.index;
          song.save();
          
          return res.sendStatus(200);
    } catch (error) {
      console.log("error", error);
            return res.sendStatus(500); 
    }
});
    
    
module.exports = router;