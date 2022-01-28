const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const validateCutomer = (customer) => {
  const customerSchema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string()
      .min(10)
      .required()
      .regex(/^[0-9()-]+$/),
    isGold: Joi.boolean().required(),
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
      required: true,
    },
  })
);

const router = express.Router();

//GET
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
  } catch (ex) {
    console.log(ex.message);
  }

  if (!customer) {
    res.status(404).send(`No customer with id ${req.params.id} found...`);
  }

  res.send(customer);
});

//POST
router.post("/", async (req, res) => {
  const { error } = validateCutomer(req.body);
  if (error) return res.status(400).send(error.message);

  const newCustomer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  let result;
  try {
    result = await newCustomer.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
    return res.status(400).send(`Failed to saved new customer.`);
  }

  res.send(result);
});

//PUT
router.post("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!customer)
    res.status(404).send(`No customer with id ${req.body.id} found...`);

  res.send(customer);
});

//DELETE
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findOneAndDelete(req.params.id);

  if (!customer)
    res.status(404).send(`No customer with id ${req.body.id} found...`);

  res.send(customer);
});

module.exports = router;
