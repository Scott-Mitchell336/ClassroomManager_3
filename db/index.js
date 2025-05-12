const pg = require("pg");
const { Client } = pg;
const client = new Client({
  user: "postgres",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "34a-classroom_manager",
});

client.connect();

module.exports = {
  query: (text, params) => client.query(text, params),
};
