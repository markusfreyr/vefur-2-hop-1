require('dotenv').config();

const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const books = require('./routes/books');
const categories = require('./routes/categories');
const { passport } = require('./authenticate');

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

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
  // res.render('error');
});

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
