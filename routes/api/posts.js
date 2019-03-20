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

/**
 * @route POST api/posts/like/:id
 * @description Like a post
 * @access Private
 */
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }
          //  add user id to likes
          post.likes.unshift({
            user: req.user.id
          });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "post not found." }));
    });
  }
);

/**
 * @route POST api/posts/unlike/:id
 * @description unlike a post
 * @access Private
 */
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already unliked this post" });
          }
          // find remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // console.log(removeIndex);

          //  remove user id to likes
          if (removeIndex > -1) {
            post.likes.splice(removeIndex, 1);
          }

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ nopostfound: "post not found." }));
    });
  }
);

/**
 * @route POST api/posts/comment/:id
 * @description comment a post
 * @access Private
 */
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          user: req.user.id,
          avatar: req.user.avatar,
          name: req.user.name,
          text: req.body.text
        };

        post.comments.unshift(newComment);

        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(404).json({ nopostfound: "post not found." }));
  }
);

/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @description delete comment on post
 * @access Private
 */
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ nocommentexist: "Comment doesn't exist" });
        }
        // find remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // console.log(removeIndex);

        //  remove user id to likes
        if (removeIndex > -1) {
          post.comments.splice(removeIndex, 1);
        }

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ nopostfound: "post not found." }));
  }
);

module.exports = router;
