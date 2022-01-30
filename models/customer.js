const Joi = require("joi");
const mongoose = require("mongoose");

const validateCustomer = (customer) => {
  const customerSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string()
      .min(10)
      .required()
      .regex(/^[0-9()-]+$/),
    isGold: Joi.boolean(),
  });

  return customerSchema.validate(customer);
};

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
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
  })
);

exports.Customer = Customer;
exports.validate = validateCustomer;
