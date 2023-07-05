const mysql = require('promise-mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME
});
const getConnection = () => {
  return connection;
};
module.exports = { getConnection };
