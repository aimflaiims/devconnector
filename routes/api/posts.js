const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");
/**
 * @route GET api/posts/test
 * @description Tests post route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

/**
 * @route GET api/posts
 * @description Get post
 * @access Public
 */
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

/**
 * @route GET api/posts/:id
 * @description Get post by id
 * @access Public
 */
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

/**
 * @route POST api/posts
 * @description Create a post
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar
    });

    newPost
      .save(newPost)
      .then(post => res.json(post))
      .catch(err => res.status(400).json(err));
  }
);

/**
 * @route DELETE api/posts/:id
 * @description delete a post
 * @access Private
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            errors = { unauthorized: "User not authorized" };
            return res.status(401).json(errors);
          }
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ nopostfound: "post not found." }));
    });
  }
);

module.exports = router;
