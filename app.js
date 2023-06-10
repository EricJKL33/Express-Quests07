require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const app = express();
app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const userHandler = require("./usersHandlers");
const movieHandlers = require("./movieHandlers");
const { validateMovie, validateUser } = require("./validators");
const { hashPassword } = require("./authenticate");


app.get("/api/users", userHandler.getUsers);
app.get("/api/users/:id", userHandler.getUserById);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/users", hashPassword, userHandler.postUsers);
app.post("/api/movies", movieHandlers.postMovies)
app.post("/api/movies", validateMovie, movieHandlers.postMovies);
app.post("/api/users", validateUser, userHandler.postUsers);

app.put("/api/movies/:id",validateMovie, movieHandlers.updateMovies);
app.put("/api/users/:id", hashPassword, validateUser, userHandler.updateUsers);

app.delete("/api/movies/:id", movieHandlers.removeMovies);
app.delete("/api/users/:id", userHandler.removeUsers);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
