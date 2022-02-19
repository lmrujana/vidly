const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

//GET
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const users = await User.find().sort("name");
    res.send(users);
  })
);

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    console.log(req.user);
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);

// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user)
//     return res.status(404).send(`No user with id ${req.params.id} found.`);

//   res.send(user);
// });

//POST
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid user. ${error.details[0].message}`);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already registered");

    const newUser = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    try {
      await newUser.save();
      console.log(newUser);
      const token = newUser.generateAuthToken();
      res
        .header("x-auth-token", token)
        .send(_.pick(newUser, ["name", "email"]));
    } catch (ex) {
      console.log(ex);
    }
  })
);

module.exports = router;
