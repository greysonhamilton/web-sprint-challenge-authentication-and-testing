const router = require('express').Router();
const jwt = require("jsonwebtoken");
const db = require("../../data/dbConfig");
const bcrypt = require("bcryptjs");
const { restrict } = require("../middleware/restricted");

router.post('/register', restrict(), async (req, res, next) => {

  try {
    const { username, password } = req.body;
    const user = await db("users")
        .where("users.username", username)

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      })
    }

    const newUser = await db("")({
      username,
      password: await bcrypt.hash(password, 12),
    })

    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }

  res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res, next) => {

  try {
    const {username, password} = req.body;
    const user = await db("")

    if(user) {
      return res.status(404).json({
        message: "Invalid credentials"
      })
    }

    const passwordValidate = await bcrypt.compare(password, user.password)
    if(passwordValidation===false) {
      return res.status(401).json({
        message: "Invalid credntials"
      })

      const toden = jwt.sign({
        username: user.username,
        expiresIn: "120m",
      }, "Keep IT safe!")

      res.cookie("token", token)
      res.json({
        message: `Welcome ${user.username}`,
        token: token
      })
    }

  } catch(err) {
      next(err)
  }
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
