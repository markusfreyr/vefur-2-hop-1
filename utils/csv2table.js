const Papa = require('papaparse');
const fs = require('fs');
const util = require('util');
const { createBook, createCategory } = require('../db/queries');

const readFileAsync = util.promisify(fs.readFile);

const encoding = 'utf8';
const input = './data/data.csv';

async function read(file) {
  const data = await readFileAsync(file);

  return data.toString(encoding);
}
function parse(data) {
  return Papa.parse(data, {
    header: true,
    delimiter: ',',
    quoteChar: '"',
  });
}

async function makeCategories(data) {
  for (const book of data) { //eslint-disable-line
    const { category = '' } = book;
    await createCategory(category); //eslint-disable-line
  }
}

async function makeBooks(data) {
  for (const book of data) { //eslint-disable-line  
    const {
      title = '',
      isbn13 = '',
      author = '',
      description = '',
      category = '',
    } = book;
    await createBook({ title, isbn13, author, description, category }); //eslint-disable-line
  }
}

async function main() {
  const data = await read(input);
  const parsed = parse(data);
  await makeCategories(parsed.data);
  await makeBooks(parsed.data);
}

main();
