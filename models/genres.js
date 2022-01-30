const Joi = require("joi");
const mongoose = require("mongoose");

const validateGenre = (genre) => {
  const genreSchema = Joi.object({
    name: Joi.string().min(5).required(),
  });

  return genreSchema.validate(genre);
};

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
