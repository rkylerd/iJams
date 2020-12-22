const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const request = require("request");
const bcrypt = require("bcrypt");
const auth = require("./auth.js");
const SALT_WORK_FACTOR = 10;

//
// Users
//

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  tokens: [],
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.tokens;
  return obj;
}

userSchema.methods.addToken = function(token) {
  this.tokens.push(token);
}

userSchema.methods.removeToken = function(token) {
  this.tokens = this.tokens.filter(t => t != token);
}

userSchema.methods.removeOldTokens = function() {
  this.tokens = auth.removeOldTokens(this.tokens);
}

userSchema.pre('save', async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

    // hash the password along with our new salt
    const hash = await bcrypt.hash(this.password, salt);

    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const Users = mongoose.model('Users', userSchema);

// Get current user if logged in.
router.get('/', auth.verifyToken, async (req, res) => {
  try {
    // look up user account
    const user = await Users.findOne({
      _id: req.user_id
    });
    
    if (!user) {
        console.log("No one is logged in yet");
         return res.status(403).send({
            error: "must login"
          });   
    }
    user.removeOldTokens();
    await user.save();
    
    return res.send(user);
  } catch (err) {
    return res.status(500);
  }
});

router.post('/register', async (req, res) => {
    
    let invalid = {error: "That username has already been taken."};
    try {
        let existingUser = await Users.findOne({username: req.body.user.username});
        if (existingUser != null) {
          return res.status(400).send(invalid);
        }
  
        const user = new Users({
              username: req.body.user.username,
              password: req.body.user.password,
              firstname: req.body.user.firstname
        });

        await user.save();
        await login(user, res);
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error});
    }
});

router.post('/login', async (req, res) => {
    let invalid = {error: "Invalid username and password comination. Try again."};
    
    try {
      let existingUser = await Users.findOne({username: req.body.user.username});
      if (!existingUser || !(await existingUser.comparePassword( req.body.user.password)) ) {
        return res.status(403).send(invalid);
      }
        
      await login(existingUser, res);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

async function login(user, res) {
  let token = auth.generateToken({
    id: user._id
  }, "24h");

  user.removeOldTokens();
  user.addToken(token);
  await user.save();

  let tokenRules = {
    expires: new Date(Date.now() + 60 * 40 * 1000) // 1 second * 60 * 40 = 40 minutes 
  }
  
  if (process.env.NODE_ENV !== 'local') {
    tokenRules.httpOnly = true;
    tokenRules.secure = true;
  }
  console.log(tokenRules, 'tokenRules')
  return res
    .cookie("token", token, tokenRules)
    .status(200)
    .send(user);
}

router.delete('/', auth.verifyToken, async (req, res) => {
  try {
    // look up user account
    const user = await Users.findOne({
      _id: req.user_id
    });
    
    res.clearCookie('token');
    
    if (!user) {
      return res.status(403).send({
        error: "You must be logged in to log out."
      });
    }
    
    user.removeToken(req.token);
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
    let data = req.body.user;
    
    try {
          let user = await Users.findOne({username: data.username});

          user.password = data.password;
          user.save();
          
          return res.sendStatus(200);
    } catch (error) {
      console.log("error", error);
      return res.sendStatus(500); 
    }
});
    
module.exports = router;