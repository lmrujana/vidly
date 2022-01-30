const express = require("express");
const mongoose = require("mongoose");
const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");

const router = express.Router();

//GET
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send(`No movie with id ${req.params.id} found...`);

  res.send(movie);
});

//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre.");

  const newMovie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    await newMovie.save();
    console.log(newMovie);
    res.send(newMovie);
  } catch (ex) {
    console.log(ex);
  }
});

//PUT
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send(`No movie with id ${req.params.id} found...`);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre.");

  movie.title = req.body.title;
  movie.genre._id = genre._id;
  movie.genre.name = genre.name;
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;

  movie = await movie.save();
  res.send(movie);
});

//DELETE
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send(`No movie sith id ${req.params.id} found...`);

  res.send(movie);
});

module.exports = router;
