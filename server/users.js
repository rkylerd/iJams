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
  lastname: {
    type: String,
    required: true
  },
  email: {
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

//If we ever needed to get all users
// router.get('/all', async (req, res) => {
//   try {
//     let users = await Users.find();
//     return res.send(users);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// Get current user if logged in.
router.get('/', auth.verifyToken, async (req, res) => {
  // look up user account
  console.log("getting current user: ", req.user_id);
  const user = await Users.findOne({
    _id: req.user_id
  });
  if (!user) {
      console.log("No one is logged in yet");
       return res.status(403).send({
          error: "must login"
        });   
  }

  return res.send(user);
});

router.post('/register', async (req, res) => {
    console.log("router.post('/register')", req.body.user);
    let invalid = {error: "That username has already been taken."};
    try {
        let existingUser = await Users.findOne({username: req.body.user.username});
        if (existingUser != null) {
            console.log(invalid + " from register");
          return res.status(400).send(invalid);
        }
  
        const user = new Users({
              username: req.body.user.username,
              password: req.body.user.password,
              firstname: req.body.user.firstname,
              lastname: req.body.user.lastname,
              email: req.body.user.email
        });

        await user.save();
        return await login(user, res);
        // return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error});
    }
});

router.post('/login', async (req, res) => {
    console.log("router.post('/login')", req.body.user);
    let invalid = {error: "Invalid username and password comination. Try again."};
    
    try {
        let existingUser = await Users.findOne({username: req.body.user.username});
        if (existingUser == null || !await existingUser.comparePassword( req.body.user.password) ) {
            console.log(invalid + " from login");
          return res.status(403).send(invalid);
        }
        
        return await login(existingUser, res);
        // return res.status(200).send(existingUser);
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
    
  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 86400 * 1000)
    })
    .status(200).send(user);
}

router.delete('/', auth.verifyToken, async (req, res) => {
  // look up user account
  console.log("logout");
  console.log("logout id: ", req.user_id);
  const user = await Users.findOne({
    _id: req.user_id
  });
  
  if (!user)
    return res.clearCookie('token').status(403).send({
      error: "You must be logged in to log out."
    });

  user.removeToken(req.token);
  await user.save();
  res.clearCookie('token');
  res.sendStatus(200);
});

// router.delete('/:id/', async (req, res) => {
//     console.log("delete id: ", req.params.id);
    
//   try {
//     await Users.deleteOne({
//       username: req.params.id.toString()
//     });
//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

/* */
router.put('/', async (req, res) => {
    let data = req.body.user;
    console.log("user", data);
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