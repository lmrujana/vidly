const Joi = require("joi");
const mongoose = require("mongoose");

const validateGenre = (genre) => {
  const genreSchema = Joi.object({
    name: Joi.string().min(5).required(),
  });

  return genreSchema.validate(genre);
};

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

exports.Genre = Genre;
exports.validate = validateGenre;
