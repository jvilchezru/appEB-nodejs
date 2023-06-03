require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

// Rutas
const users = require('./routes/userRoutes');
const categories = require('./routes/categoryRoutes');

const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cors());

app.disable('x-powered-by');

app.set('port', port);

// Llamado de rutas
users(app);
categories(app);

// 192.168.1.28 - 192.168.0.109 - 192.168.43.225

server.listen(3000, '192.168.1.28' || localhost, function () {
  console.log('Backend de la aplicación iniciado. Puerto:' + port);
});

app.get('/', (req, res) => {
  res.send('Ruta raíz');
});

app.get('/test', (req, res) => {
  res.send('Ruta test');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server
};
