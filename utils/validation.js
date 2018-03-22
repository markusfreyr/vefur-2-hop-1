const validator = require('validator');

function validateBook({
  title, isbn13, author, description, category,
}) {
  const errors = [];

  // const stringPages = pages.toString();
  if (typeof title !== 'string' || !validator.isLength(title, { min: 1, max: 180 })) {
    errors.push({
      field: 'title',
      message: 'Title must be a string of length 1 to 100 characters',
    });
  }
  if (!isbn13 || typeof isbn13 !== 'string' || Number.isNaN(parseInt(isbn13, 10)) || !validator.isLength(isbn13, 13)) {
    errors.push({
      field: 'isbn13',
      message: 'ISBN13 must be 13 digit string made of numbers',
    });
  }

  if (typeof category !== 'string' || !validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({
      field: 'category',
      message: 'Category must be a valid category of type string',
    });
  }
  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (author && typeof author !== 'string') {
    errors.push({
      field: 'author',
      message: 'Author must be of type string',
    });
  }
  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (description && typeof description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Bio must be of type string',
    });
  }
  return errors;
}

function validateCategory(name) {
  const errors = [];
  if (typeof name !== 'string' || !validator.isLength(name, { min: 1, max: 30 })) {
    errors.push({
      field: 'name',
      message: 'Category name must be a string of length 1 to 30 characters',
    });
  }

  return errors;
}

function validateUser({
  username, password, name,
}) {
  const errors = [];

  if (typeof username !== 'string' || !validator.isLength(username, { min: 3, max: 30 })) {
    errors.push({
      field: 'username',
      message: 'Username must be a string of length 3 to 30 characters',
    });
  }

  if (typeof password !== 'string' || !validator.isLength(password, { min: 6, max: 30 })) {
    errors.push({
      field: 'password',
      message: 'Password must be a string of length 6 to 30 characters',
    });
  }

  if (typeof name !== 'string' || !validator.isLength(name, { min: 1, max: 100 })) {
    errors.push({
      field: 'name',
      message: 'Name must be a string of length 1 to 100 characters',
    });
  }

  return errors;
}

function readBookvalidation({ book, rank, review }) {
  const errors = [];

  if (typeof book !== 'string' || Number.isNaN(parseInt(book, 10))) {
    errors.push({
      field: 'book_id',
      message: 'Book id must be a string of numbers',
    });
  }

  if (typeof rank !== 'string' || Number.isNaN(parseInt(rank, 10)) || rank > 5 || rank < 0 || rank.length !== 1) {
    errors.push({
      field: 'rank',
      message: 'Rank must be a string of numbers between 1 and 5',
    });
  }

  if (review && typeof review !== 'string') {
    errors.push({
      field: 'review',
      message: 'Review must be of type string',
    });
  }

  return errors;
}

function queryError(err, msg) {
  console.error(msg, err);
  return {
    success: false,
    validation: [{ error: err }],
    item: '',
  };
}

module.exports = {
  validateBook,
  validateCategory,
  validateUser,
  queryError,
  readBookvalidation,
};
