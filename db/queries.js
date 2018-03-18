const bcrypt = require('bcrypt');
const { Client } = require('pg');
const validator = require('validator');
const xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/h1';


/**
 * TODO þarf að prófa þetta fall, viljum við hafa allt þarna
 * (ekki skilda að hafa öll skilyrði í verkefni)
 * viljum við validate-a isbn tölur svona vel?
 */
// ISBN10, published, pages, language,
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
  if (Number.isNaN(isbn13) || !validator.isLength(isbn13, { min: 13, max: 13 })) {
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
      field: 'bio',
      message: 'Bio must be of type string',
    });
  }
  /*
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
*/
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

  return errors;
}

function queryError(err, msg) {
  // 23505 er error kóði fyrir unique violation (hjá okkur fyrir title eða ISBN13)
  if (err.code === '23505') {
    // Ef það var fyrir title
    if (err.detail.includes('title')) {
      return {
        success: false,
        validation: [{ error: 'Title must be unique (title already exists)' }],
        item: '',
      };
    } else if (err.detail.includes('isbn13')) { // Ef það var fyrir isbn13
      return {
        success: false,
        validation: [{ error: 'ISBN13 must be unique (ISBN13 already exists)' }],
        item: '',
      };
    }
    // annars er það category
    return {
      success: false,
      validation: [{ error: 'Category must be unique (category already exists)' }],
      item: '',
    };
  }

  // Ef það var ekki 23505 villa þá er það óþekkt villa sem við köstum
  console.error(msg, err);
  throw err;
}

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(q, values);
    return result;
  } catch (err) {
    return { error: err };
  } finally {
    await client.end();
  }
}

async function create(params) {

}

async function login(params) {

}

async function update(params) {

}

async function readOne(params) {

}

async function readAll(offset, limit) {
  const q = 'SELECT * FROM books OFFSET $1 LIMIT $2';
  const result = await query(q, [offset, limit]);
  if (result.error) {
    const msg = 'Error reading books';
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}

async function createBook({
  title,
  isbn13,
  author,
  description,
  category,
} = {}) {
  const validation = validateBook({
    title,
    isbn13,
    author,
    description,
    category,
  });


  if (validation.length > 0) {
    return {
      success: false,
      validation,
    };
  }

  const cleanTitle = xss(title);
  const cleanISBN13 = xss(isbn13);
  const cleanAuthor = xss(author);
  const cleanDescription = xss(description);
  const cleanCategory = xss(category);

  const q = 'INSERT INTO books (title, ISBN13, author, description, categorie) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [cleanTitle, cleanISBN13, cleanAuthor, cleanDescription, cleanCategory];


  const result = await query(q, values);

  if (result.error) {
    const msg = 'Error creating book';
    return queryError(result.error, msg);
  }

  return {
    success: true,
    validation: [],
    item: result.rows[0],
  };
}

async function delBook(params) {

}

async function readCategories(offset, limit) {
  const q = 'SELECT * FROM categories OFFSET $1 LIMIT $2';
  const result = await query(q, [offset, limit]);
  if (result.error) {
    const msg = 'Error reading categories';
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}

async function createCategory({ name }) {
  const validation = validateCategory(name);

  if (validation.length > 0) {
    return {
      success: false,
      validation,
    };
  }

  const cleanCatName = xss(name);
  const q = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
  const result = await query(q, [cleanCatName]);

  if (result.error) {
    const msg = 'Error creating category';
    return queryError(result.error, msg);
  }

  return {
    success: true,
    validation: [],
    item: result.rows[0],
  };
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
  const validation = validateUser({ username, name, password });

  if (validation.length > 0) {
    return {
      success: false,
      validation,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, name, password) VALUES ($1, $2, $3) RETURNING id, username, name';

  const result = await query(q, [username, name, hashedPassword]);

  if (result.error) {
    const msg = 'Error reading categories';
    return queryError(result.error, msg);
  }

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
