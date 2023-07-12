require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const session = require('express-session');
const Keys = require('./config/keys');

// Inicializar firebase
admin.initializeApp({
  credentials: admin.credential.cert(serviceAccount)
});

const upload = multer({
  storage: multer.memoryStorage()
});

const port = process.env.PORT || 3000;

// Rutas
const users = require('./routes/user.routes');
const categories = require('./routes/category.routes');
const services = require('./routes/service.routes');
const requests = require('./routes/request.routes');
const validations = require('./routes/validation.routes');
const comments = require('./routes/comment.routes');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(
  session({
    secret: Keys.secretOrKey,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.disable('x-powered-by');
app.set('port', port);

// Llamado de rutas
users(app, upload);
categories(app);
services(app, upload);
requests(app);
validations(app);
comments(app);

// 192.168.43.225 - 192.168.1.107 - 192.168.3.249
server.listen(port, function () {
  console.log('Backend de la aplicación iniciado. Puerto:' + port);
});

app.get('/', (req, res) => {
  res.send('Ruta raíz');
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
