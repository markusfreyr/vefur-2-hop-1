const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(q, values);
    return result;
  } catch (err) {
    return { error: 'Error running query' };
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
  const { rows } = result;
  return rows;
}


async function createBook({
  title,
  ISBN13,
  author,
  description,
  categorie,
}) {
  const q = 'INSERT INTO books (title, ISBN13, author, description, categorie) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await query(q, [title, ISBN13, author, description, categorie]);

  if (!result.error) {
    return {
      success: true,
      validation: [],
      item: result.rows[0],
    };
  }

  return {
    success: true,
    validation: [{ error: 'Þetta er nú þegar til' }],
    item: '',
  };
}

async function delBook(params) {

}

async function readCategories(params) {

}

async function createCategory(params) {

}

// Á EFTIR AÐ REFACTOR-A ÞETTA FYRIR KNEX

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
};
