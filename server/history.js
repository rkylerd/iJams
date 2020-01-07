const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const request = require("request");

//
// History
//

const schema = new mongoose.Schema({
    username: String,
    searchHistory: []
});

const History = mongoose.model('SearchHistory', schema);

const addHistory = async (username, searchHistory) => {
    const history = new History(
      {
          username: username,
          searchHistory: searchHistory
      }
    );
  
    try {
        await history.save();
        return history;
    } catch (error) {
        console.log(error);
        throw new error(error);
    }
};

router.get('/', async (req, res) => {
    console.log("router.get('/'");
  try {
    let songs = await History.find();
    return res.send(songs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/:id', async (req, res) => {
    console.log("history post");
    
    try {
        return res.send( addHistory(req.params.id, []) );
    } catch(error) {
        return res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    console.log("delete id: ", req.params.id);
    
  try {
    await History.deleteOne({
      trackId: req.params.id.toString()
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

/* */
router.put('/', async (req, res) => {
      let searchTerm = req.body.term;
      
      try {
        let history = await History.findOne({username: req.body.username});
        
        if (history == null) {
            addHistory(req.body.username, []);
        } else {
            history.searchHistory.push(searchTerm);
        }
        history.save();
        
        return res.sendStatus(200);
    } catch (error) {
        console.log("router.put error",error);
        return res.sendStatus(500); 
    }
});
    
    
module.exports = router;