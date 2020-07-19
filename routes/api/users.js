const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../models/User");
const { route } = require("./profile");

// @route GET api/posts/users
//@desc Tests Users Routes
//access Public
router.get("/test", (req, res) => res.json({ msg: "Just for Testing" }));

// @route POST api/users/register
// @desc  Register User
//@ access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email Already Exixts" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm", // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log("Error Thrown: " + err);
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              })
            )
            .catch((err) => console.log("Error came :" + err));
        });
      });
    }
  });
});

// @route POST api/users/register
// @desc  Login User / Returning JWT Token
//@ access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by Email
  User.findOne({ email }).then((user) => {
    //Check for User
    if (!user) {
      return res.status(404).json({ email: "User not Found" });
    }
    //check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(payload, keys.secretOrKey, (err, token) => {
          res.json({ token: "Bearer " + token });
        });
      } else {
        return res
          .status(400)
          .json({ password: "Email or Password is Incorrect" });
      }
    });
  });
});

// @route POST api/users/current
// @desc  Returns Current User
//@ access Privatre
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
