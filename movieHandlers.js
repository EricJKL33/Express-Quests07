const database = require("./database");

const getMovies = (req, res) => {
  let sql = "select * from movies";
  const sqlValues = [];

if (req.query.color != null) {
  sql += " where color = ?";
  sqlValues.push(req.query.color);

  if (req.query.max_duration != null) {
    sql += " and duration <= ?";
    sqlValues.push(req.query.max_duration);
  }
} else if (req.query.max_duration != null) {
  sql += " where duration <= ?";
  sqlValues.push(req.query.max_duration);
}

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((movie) => movie.id == id);
  database
  .query("select * from movies where id = ?", [id])
  .then(() => {
    movie !== null ? res.json(movie) : res.status(404).send("Not found");
  }).catch((err) => {
    res.status(500).send(`Error retrieving data : ${err}`);
  })
};

const postMovies = (req,res) => {
  const {title, director, year, color, duration} = req.body;
  console.log(req.body);
  database
    .query("INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)", 
      [title, director, year, color, duration])
    .then(([result]) => {
      console.log(result);
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
}

const updateMovies = (req,res) => {
  const {title, director, year, color, duration} = req.body;
  const id = parseInt(req.params.id);
  console.log(req.body, req.params.id);

  database
  .query("UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
  [title, director, year, color, duration, id])
  .then(([result]) => {
    console.log(result);
    if( result.affectedRows === 0 ) {
      res.status(404).send("Not found");
    } else {
      res.status(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error updating the movie entry");
  })
}

const removeMovies = (req, res) => {
  const id = parseInt(req.params.id);

  database
  .query("DELETE FROM movies WHERE id = ?", [id])
  .then(([result]) => {
    if(result.affectedRows === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(204)
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send("An error occured while deleting the movie");
  })
}

module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  updateMovies,
  removeMovies,
};
