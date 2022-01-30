const Joi = require("joi");
const mongoose = require("mongoose");

const validateUser = (user) => {
  const userSchema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
  });

  return userSchema.validate(user);
};

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      trim: true,
    },
  })
);

exports.User = User;
exports.validate = validateUser;
