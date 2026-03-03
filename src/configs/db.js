const { Pool } = require("pg");
require("dotenv").config();
const {
  db: { host, name, password, port, username },
} = require("./config");

const pool = new Pool({
  user: username || "postgres",
  host: host || "localhost",
  database: name || "monkey_english",
  password: password || "yourpassword",
  port: port || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
