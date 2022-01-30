const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { movieSchema } = require("./movies");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        phone: {
          type: String,
          required: true,
          length: 10,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 100,
        },
        dailyRentalRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      default: 0,
    },
  })
);

const validateRental = (rental) => {
  const rentalSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return rentalSchema.validate(rental);
};

exports.validate = validateRental;
exports.Rental = Rental;
