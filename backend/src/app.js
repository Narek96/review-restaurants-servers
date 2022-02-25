require('../src/connection/connection');
require('./config/passport');
require('./config/fbPassport');

const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const app = express();
const router = require('./routes');
const { initDb } = require('./db/dbInit');
const { writeStatus } = require('./utils/server')

initDb()

app.use(cors());
app.options('*', cors());

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.resolve(process.env.SERVE_FOLDER)));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// for Passport:
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

router(app)

//Error handler
app.use((error, req, res, next) => {
  const message = error.message || error.statusMessage;
  return writeStatus(res, true, { message });
});

// app.listen(4000)
module.exports = app;