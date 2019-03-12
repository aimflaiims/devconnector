const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

// Profile model
const Profile = require("../../models/Profile");
// User profile
const User = require("../../models/User");

/**
 * @route GET api/profile/test
 * @description Tests Profile route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

/**
 * @route GET api/profile
 * @description Get current user Profile
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no rofile for this user";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
