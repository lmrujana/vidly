const express = require("express");
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genres");

const router = express.Router();

//GET
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

const getGenreById = async (id) => {
  return await Genre.findById(id);
};

router.get("/:id", async (req, res) => {
  let genre;
  try {
    genre = await getGenreById(req.params.id);
  } catch (ex) {
    console.log(ex.message);
  }

  if (!genre)
    return res.status(404).send(`No genre with id ${req.params.id} found...`);

  res.send(genre);
});

//POST
const createGenre = async (reqBod) => {
  const newGenre = new Genre({
    name: reqBod.name,
  });

  try {
    const result = await newGenre.save();
    console.log(result);
    return result;
  } catch (ex) {
    console.log(ex);
  }
};

router.post("/", async (req, res) => {
  const reqBod = req.body;
  const { error } = validate(reqBod);
  if (error) return res.status(400).send(error.message);

  const newGenre = await createGenre(reqBod);

  res.send(newGenre);
});

//PUT
router.put("/:id", async (req, res) => {
  const reqBod = req.body;
  const { error } = validate(reqBod);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    res.status(404).send(`No genre with id ${req.params.id} found...`);
  }

  res.send(genre);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send(`No genre with id ${req.params.id} found...`);

  res.send(genre);
});

module.exports = router;
