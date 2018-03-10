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

