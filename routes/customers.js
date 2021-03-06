const express = require("express");
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

const router = express.Router();

//GET
router.get("/", auth, async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", auth, async (req, res) => {
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
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const newCustomer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  try {
    await newCustomer.save();
    console.log(newCustomer);
    res.send(newCustomer);
  } catch (ex) {
    console.log(ex.message);
    return res.status(400).send(`Failed to saved new customer.`);
  }
});

//PUT
router.post("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

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
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    res.status(404).send(`No customer with id ${req.body.id} found...`);

  res.send(customer);
});

module.exports = router;
