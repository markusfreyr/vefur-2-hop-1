require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const books = require('./routes/books');
const categories = require('./routes/categories');

const app = express();
app.use(express.json());


app.use(bodyParser.json());

app.use('/', index);
app.use('/users', users);
app.use('/books', books);
app.use('/categories', categories);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
