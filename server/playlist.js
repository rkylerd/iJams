const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const request = require("request");

//
// Songs
//
const playlistSchema = new mongoose.Schema({
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
  trackLengthSeconds: Number,
  index: Number,
  username: String
});

const Song = mongoose.model('Song', playlistSchema);

router.get('/:id', async (req, res) => {
  try {
    let songs = await Song.find({username: req.params.id.toString()});
    return res.send(songs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
    try {
        let playlistSong = await Song.findOne({
                username: req.body.song.username,
                trackId: req.body.song.trackId
              });
        if (playlistSong != null) {
          return res.status(400).send("That song is already in your playlist.");
        }
  
        const song = new Song({
              ...req.body.song
        });

        await song.save();
        return res.status(200).send(song);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:username/:trackId', async (req, res) => {
  try {
    const username = req.params.username;
    const trackId = req.params.trackId;
    await Song.deleteOne({
      username: username,
      trackId: trackId
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body.song;
    let song = await Song.findOne({
      username: req.params.id,
      trackId: req.body.song.trackId
    });

    song.index = data.index;
    song.save();
    
    res.sendStatus(200);
  } catch (error) {
    console.log("error", error);
    res.sendStatus(500); 
  }
});
    
    
module.exports = router;