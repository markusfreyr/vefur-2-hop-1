require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const books = require('./routes/books');
const categories = require('./routes/categories');
// Er ekki viss hvort þetta virkar svona annars hægt
// sja linu 20
// að setja upp passport hér
const { passport } = require('./authenticate');

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/users', users);
app.use('/books', books);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
