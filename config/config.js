const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  connectTimeout: 30000
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
    connection.release();
  }
});

pool.query = util.promisify(pool.query);

module.exports = pool;
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DBNAME
// });

// const query = util.promisify(connection.query).bind(connection);
// const connect = util.promisify(connection.connect).bind(connection);
// const end = util.promisify(connection.end).bind(connection);

// module.exports = {
//   query,
//   connect,
//   end
// };
