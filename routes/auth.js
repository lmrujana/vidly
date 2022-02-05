const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const router = express.Router();

const validate = (user) => {
  const userSchema = Joi.object({
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
  });

  return userSchema.validate(user);
};

//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send(`Invalid user. ${error.details[0].message}`);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken(); //DONT HARD CODE SECRET HERE

  res.send(token);
});

module.exports = router;
