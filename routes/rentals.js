const express = require("express");
const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const Fawn = require("fawn");
const { Customer } = require("../models/customer");

const router = express.Router();

Fawn.init("mongodb://localhost/vidly");

//GET
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

//POST
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("Invalid rental.");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send(`Customer with id ${req.body.customerId} not found...`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res
      .status(404)
      .send(`Movie with id ${req.body.movieId} not found...`);

  if (movie.numberInStock === 0)
    return res.status(400).send(`Movie with id ${movieId} is out of stock.`);

  const newRental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", newRental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run();

    res.send(newRental);
  } catch (ex) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;
