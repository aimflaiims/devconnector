const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
const User = require("../../models/User");

/**
 * @route GET api/users/test
 * @description Tests Users route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "users works" }));

/**
 * @route POST api/users/register
 * @description Register User
 * @access Public
 */
router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exist" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          }
        });
      });
    }
  });
});

/**
 * @route POST api/users/login
 * @description Login User / returning the JWT token
 * @access Public
 */
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find the user by email
  User.findOne({
    email
  })
    .then(user => {
      if (!user) {
        res.status(404).json({
          email: "user not found"
        });
      } else {
        // check password
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            // user matched

            // JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            // sign token
            jwt.sign(
              payload,
              keys.secret,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            res.status(400).json({ password: "Password incorrect" });
          }
        });
      }
    })
    .catch();
});

/**
 * @route Get api/users/login
 * @description Return current user
 * @access Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
