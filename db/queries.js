const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://:@localhost/h1',
  searchPath: ['knex', 'public'],
});

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

}

async function delBook(params) {

}

async function readCategories(params) {

}

async function createCategory(params) {

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

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';

  const result = await query(q, [username, hashedPassword]);

  return result.rows[0];
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
}
