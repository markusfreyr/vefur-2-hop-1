const Papa = require('papaparse');
const fs = require('fs');
const util = require('util');
const { createBook, createCategory } = require('./db/queries');

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

// þarf að gera betur prófaði forEach, en það hinkrar ekki eftir
// await. Þetta virkar fínt en eslint kvartar, óli minnist á þetta
// í verkefnalýsingu. svo er ez að gera books, same same!
async function makeCategories(data) {
  for (const book of data) { //eslint-disable-line
    const { category } = book;
    await createCategory(category); //eslint-disable-line
  }
}

async function makeBooks(data) {
  for (const book of data) { //eslint-disable-line  
    const { title, isbn13, author, description, category } = book;
    await createBook({ title, isbn13, author, description, category }); //eslint-disable-line
  }
}

async function main() {
  const data = await read(input);
  const parsed = parse(data);
  //makeCategories(parsed.data);
  makeBooks(parsed.data);
  // gogn komin á json form þarf bara að setja inn i töflu með loop 😍
  // console.log('Done filling tables!');
}

main();
