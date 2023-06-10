require("dotenv").config();
const mysql = require("mysql2/promise");

// CONFIG
const database = mysql.createPool({
  host: process.env.DB_HOST, // server address
  port: process.env.DB_PORT, // (mysql) DB server PORT, not to be mistaken with express app PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

database
  .getConnection()
  .then(() => {
    console.log("datatbase reached!");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = database;
