const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/test
//@desc Tests Profile Routes
//access Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route GET api/profile
//@desc Get Current User Profile
//access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noProfile = "There is no such profile";
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
);

module.exports = router;
