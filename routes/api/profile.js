const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

// Profile model
const Profile = require("../../models/Profile");
// User profile
const User = require("../../models/User");

// load profile validaon
const validateProfileInput = require("../../validation/profile");

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
      .populate("user", ["name", "avatar"])
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

/**
 * @route GET api/profile/all
 * @description Get all user Profile
 * @access Public
 */
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "No profiles";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route GET api/profile/handle/:handle
 * @description Get user Profile by handle
 * @access Public
 */
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({
    handle: req.params.handle
  })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route GET api/profile/user/:user_id
 * @description Get user Profile by user id
 * @access Public
 */
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({
    handle: req.params.user_id
  })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route POST api/profile
 * @description Create current user Profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //  skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //  social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.medium) profileFields.social.medium = req.body.medium;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        if (profile) {
          // update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          //  create
          // checkk if handle exist
          Profile.findOne({
            handle: profileFields.handle
          }).then(profile => {
            if (profile) {
              errors.handle = "Handle already exist";
              res.status(400).json(errors);
            } else {
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile));
            }
          });
        }
      })
      .catch();
  }
);

module.exports = router;
