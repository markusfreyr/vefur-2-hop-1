const bcrypt = require('bcrypt');
const { Client } = require('pg');
const xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/h1';

const {
  validateBook,
  validateCategory,
  validateUser,
  queryError,
} = require('./validation');

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

// Fall sem les töflu 'table' með skilyrðum 'params'
async function readAll(table, conditions, values) {
  const q = `SELECT * FROM ${table} ${conditions}`;
  const result = await query(q, values);
  if (result.error) {
    const msg = `Error reading table ${table}`;
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}

async function update(id, body) {
  // Sækja info um bók sem á að breyta
  const conditions = 'WHERE id = $1';
  const oldBook = await readAll('books', conditions, [id]);
  // Ef bókin sem á að breyta er ekki til/fannst ekki
  if (!oldBook) {
    return {
      success: false,
      notfound: true,
    };
  }

  // object sem er jafnt því sem var sent inn, þar sem ekkert var sent er það eins (oldBook)
  const {
    title = oldBook.title,
    isbn13 = oldBook.isbn13,
    author = oldBook.author,
    description = oldBook.description,
    category = oldBook.category,
  } = body;

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

  const q = 'UPDATE books SET title = $1, ISBN13 = $2, author = $3, description = $4, category = $5 WHERE id = $6 RETURNING *';
  const values = [cleanTitle, cleanISBN13, cleanAuthor, cleanDescription, cleanCategory, id];

  const result = await query(q, values);

  if (result.error) {
    const msg = 'Error updating book';
    return queryError(result.error, msg);
  }

  return {
    success: true,
    validation: [],
    item: result.rows[0],
  };
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

  const q = 'INSERT INTO books (title, ISBN13, author, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *';
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

async function readUsers(params, values) {
  const q = `SELECT id, username, name, url FROM users ${params}`;
  const result = await query(q, values);
  if (result.error) {
    const msg = 'Error reading table users';
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}


async function patchMe(params) {

}

async function updatePhoto(params) {

}

async function createReadBook({
  user_id: user, book_id: book, rank, review,
} = {}) {
  const q = 'INSERT INTO read_books (user_id, book_id, rank, review) VALUES ($1, $2, $3, $4) RETURNING *';

  const result = await query(q, [user, book, rank, review]);

  if (result.error) {
    const msg = 'Error adding read book categories';
    return queryError(result.error, msg);
  }

  // vantar validation
  return {
    success: true,
    validation: [],
    item: result.rows[0],
  };
}

async function getReadBooks(id) {
  const q = 'SELECT * FROM read_books WHERE user_id = $1';

  const result = await query(q, [id]);

  if (result.error) {
    const msg = 'Error running query';
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}

async function searchBooks(values) {
  const q = 'SELECT * FROM books WHERE to_tsvector(title || description) @@ to_tsquery($1) OFFSET $2 LIMIT $3';
  const result = await query(q, values);

  if (result.error) {
    const msg = 'Error running query';
    return queryError(result.error, msg);
  }
  const { rows } = result;
  return rows;
}

module.exports = {
  update,
  readAll,
  createBook,
  findByUsername,
  readUsers,
  createUser,
  createCategory,
  patchMe,
  updatePhoto,
  createReadBook,
  getReadBooks,
  searchBooks,
};
