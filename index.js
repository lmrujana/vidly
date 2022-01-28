const express = require("express");
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.err("Could not connect to MongoDB"));

const app = express();

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views"); //default

app.use("/", home);

app.use("/api/genres", genres);
app.use("/api/customers", customers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}...`);
});
