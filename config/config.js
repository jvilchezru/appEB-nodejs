// const mysql = require('promise-mysql');
// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// });
// const getConnection = () => {
//   return connection;
// };
// module.exports = { getConnection };

const promise = require('bluebird');
const options = {
  promiseLib: promise,
  query: (e) => {}
};

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const databaseConfig = {
  'host': process.env.DB_HOST,
  'port': 5432,
  'database': process.env.DB_DBNAME,
  'user': process.env.DB_USERNAME,
  'password': process.env.DB_PASSWORD
};

const db = pgp(databaseConfig);

module.exports = db;
