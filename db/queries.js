import { config } from '../../../../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bluebird';

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://:@localhost/h1',
  searchPath: ['knex', 'public'],
});
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;

const validator = require('validator');
const xss = require('xss');
const ISBN = require('isbn');

/**
 * TODO þarf að prófa þetta fall, viljum við hafa allt þarna
 * (ekki skilda að hafa öll skilyrði í verkefni)
 * viljum við validate-a isbn tölur svona vel?
 */
function validateBook({
  title, ISBN13, author, bio, category, ISBN10, published, pages, language,
}) {
  const errors = [];
  const isbn13a = ISBN.parse(ISBN13);
  const isbn10a = ISBN.parse(ISBN10);
  const stringPages = pages.toString();


  if (!validator.isLength(title, { min: 1, max: 255 })) {
    errors.push({
      field: 'title',
      message: 'Title must be a string of length 1 to 255 characters',
    });
  }

  if (!isbn13a.isIsbn13()) {
    errors.push({
      field: 'ISBN13',
      message: 'ISBN13 must be 13 digit string made of numbers',
    });
  }

  if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({
      field: 'category',
      message: 'Category must be a valid category string',
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
  if (bio && typeof bio !== 'string') {
    errors.push({
      field: 'bio',
      message: 'Bio must be of type string',
    });
  }

  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (ISBN10 && !isbn10a.isIsbn10()) {
    errors.push({
      field: 'ISBN10',
      message: 'ISBN10 must be 10 digit string made of numbers',
    });
  }

  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (published && typeof published !== 'string') {
    errors.push({
      field: 'published',
      message: 'The publish date must be of type string',
    });
  }

  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (stringPages && !validator.isInt(stringPages, { min: 0 })) {
    errors.push({
      field: 'pages',
      message: 'Pages must be a integer(can be string) larger than 0',
    });
  }

  // Ekki krafa, en ef eitthvað slegið inn þá þarf hann að vera réttur
  if (language && (typeof language !== 'string' || language.length !== 2)) {
    errors.push({
      field: 'language',
      message: 'Language must be a string with a length of 2 charachters',
    });
  }

  return errors;
}

function validateCategory({ categoryName }) {
  const errors = [];

  if (typeof categoryName !== 'string' || !validator.isLength(categoryName, { min: 1, max: 30 })) {
    errors.push({
      field: 'categoryName',
      message: 'Category name must be a string of length 1 to 30 characters',
    });
  }

  return errors;
}

function validateUser({
  username, password, name, picture,
}) {
  const errors = [];

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    errors.push({
      field: 'username',
      message: 'Username must be a string of length 3 to 30 characters',
    });
  }

  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errors.push({
      field: 'password',
      message: 'Password must be a string of length 6 to 30 characters',
    });
  }

  if (!validator.isLength(name, { min: 0, max: 30 })) {
    errors.push({
      field: 'name',
      message: 'Name must be a string of length 1 to 255 characters',
    });
  }

  // Ekki krafa, en ef eitthvað er slegið inn þá þarf það að vera strengur
  if (picture && typeof picture !== 'string') {
    errors.push({
      field: 'picture',
      message: 'Picture must be of type string',
    });
  }

  return errors;
}

// Skoðið knex js -- http://knexjs.org/

// bara smá hugmyndir um queries

async function create(params) {

}

async function login(params) {

}

async function update(params) {

}

async function readOne(params) {

}

async function readAll(params) {

}

async function createBook(params) {
  // verður sirka svona?....
  const validation = validateBook(params);

  if (validation.length > 0) {
    return {
      success: false,
      validation,
    };
  }

  // hér geta xss á params
}

async function delBook(params) {

}

async function readCategories(params) {

}

async function createCategory(params) {
  // verður sirkar svona?...
  const validation = validateCategory(params);

  if (validation.length > 0) {
    return {
      success: false,
      validation,
    };
  }

  // hér gera xss á params
}

// Á EFTIR AÐ REFACTOR-A ÞETTA FYRIR KNEX

/*
  Tekur inn query og parametra frá öllum föllum sem eru
  skilgr fyrir neðan þetta fall. Viljum líklegast henda þessu
  þegar það er búið að refactor fyrir knex eða láta knex nota
  sbr hjálpardude?
*/
async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser({ username, name, password } = {}) {
  const hashedPassword = await bcrypt.hash(password, 11);

  // vantar að validate-a, þarf að senda meira info inn (username,password, name, picture(optional))
  // svo ssx-a ef engar villur
 
=======
  const q = 'INSERT INTO users (username, name, password) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, name, hashedPassword]);

  // vantar validation
  return {
    success: true,
    validation: [],
    item: result.rows[0],
  };
}

module.exports = {
  create,
  login,
  update,
  readOne,
  readAll,
  createBook,
  delBook,
  findByUsername,
  findById,
  createUser,
  readCategories,
  createCategory,
};
