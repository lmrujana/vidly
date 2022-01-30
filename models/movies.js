const { required } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genres");

const validateMovie = (movie) => {
  const movieSchema = Joi.object({
    title: Joi.string().required().min(5).max(100),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
    genreId: Joi.string().required(),
  });

  return movieSchema.validate(movie);
};

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

exports.Movie = Movie;
exports.validate = validateMovie;
