const express = require("express");
const genres = require("./routes/genres");
const home = require("./routes/home");

const app = express();

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views"); //default

app.use("/", home);

app.use("/api/genres", genres);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}...`);
});
