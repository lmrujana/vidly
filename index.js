const express = require("express");
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const user = require("./routes/user");
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
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/user", user);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}...`);
});
