const express = require("express");
const Joi = require("joi");

const router = express.Router();

const genres = [
  {
    id: 1,
    name: "comedy",
  },
  {
    id: 2,
    name: "horror",
  },
  {
    id: 3,
    name: "action",
  },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = getGenreById(req.params.id);
  if (!genre)
    return res.status(404).send(`No genre with id ${req.params.id} found...`);

  res.send(genre);
});

//POST
router.post("/", (req, res) => {
  const reqBod = req.body;
  const { error } = validateGenre(reqBod);
  if (error) return res.status(400).send(error.message);

  const newGenre = {
    id: genres.length + 1,
    name: reqBod.name,
  };

  genres.push(newGenre);

  res.send(newGenre);
});

//PUT
router.put("/:id", (req, res) => {
  const genre = getGenreById(req.params.id);
  if (!genre)
    return res.status(404).send(`No genre with id ${req.params.id} found...`);

  const reqBod = req.body;
  const { error } = validateGenre(reqBod);
  if (error) return res.status(400).send(error.message);

  genre.name = reqBod.name;
  res.send(genre);
});

// DELETE
router.delete("/:id", (req, res) => {
  const genre = getGenreById(req.params.id);
  if (!genre)
    return res.status(404).send(`No genre with id ${req.params.id} found...`);

  let index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

const getGenreById = (id) => {
  return genres.find((g) => g.id === parseInt(id));
};

const validateGenre = (genre) => {
  const genreSchema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return genreSchema.validate(genre);
};

module.exports = router;
