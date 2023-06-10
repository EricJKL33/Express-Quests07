const database = require("./database");

const getUsers = (req, res) => {
  let sql = "select * from users";
  const sqlValues = [];

  if(req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);

    if(req.query.city != null) {
      sql += "and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
  .query("SELECT * FROM users WHERE id = ?", [id])
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send("Not found");
      } else {
        res.json(users[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error retrieving data: ${err}`);
    });
};

const postUsers = async (req, res) => {
  const { firstname, lastname, email, city, language, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language, password) VALUES (?,?,?,?,?,?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        console.log(result);
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving user");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error hashing password");
  }
};


const updateUsers = async (req, res) => {
  const { firstname, lastname, email, city, language, password } = req.body;
  const id = req.params.id;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await argon2.hash(password);
    }
    const queryParameters = [];
    let query = "UPDATE users SET";
    if (firstname) {
      query += " firstname = ?,";
      queryParameters.push(firstname);
    }
    if (lastname) {
      query += " lastname = ?,";
      queryParameters.push(lastname);
    }
    if (email) {
      query += " email = ?,";
      queryParameters.push(email);
    }
    if (city) {
      query += " city = ?,";
      queryParameters.push(city);
    }
    if (language) {
      query += " language = ?,";
      queryParameters.push(language);
    }
    if (hashedPassword) {
      query += " password = ?,";
      queryParameters.push(hashedPassword);
    }
    query = query.slice(0, -1);
    query += " WHERE id = ?";
    queryParameters.push(id);
    
    database
      .query(query, queryParameters)
      .then(([result]) => {
        console.log(result);
        if (result.affectedRows === 0) {
          res.status(404).send("Not found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating user entry");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error hashing password");
  }
};


const removeUsers = (req,res) => {
  const id = req.params.id;
  database
  .query("DELETE FROM users WHERE id = ?", [id])
  .then(([result]) => {
    if(result.affectedRows === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("An error occured while deleting the user")
  })
}

module.exports = {
  getUsers, 
  getUserById,
  postUsers,
  updateUsers,
  removeUsers,
}