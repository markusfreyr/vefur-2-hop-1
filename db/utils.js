const xss = require('xss');

const {
  readAll,
  readUsers,
  searchBooks,
} = require('../db/queries');

async function makeResult(rows, table, offset, limit) {
  const result = {
    links: {
      self: {
        href: `http://localhost:3000/${table}/?offset=${offset}&limit=${limit}`,
      },
    },
    limit,
    offset,
    items: rows,
  };

  // Ef þetta er ekki fyrsta síða, þá setjum við 'prev' síðu
  if (offset > 0) {
    result.links.prev = {
      href: `http://localhost:3000/${table}/?offset=${offset - limit}&limit=${limit}`,
    };
  }

  // Ef raðir færri en limit þá kemur ekki next síða
  if (!(rows.length < limit)) {
    result.links.next = {
      href: `http://localhost:3000/${table}/?offset=${Number(offset) + limit}&limit=${limit}`,
    };
  }

  return result;
}

// fall sem les allt úr töflu (books, categories eða users)
async function getAll(body, table) {
  // frumstilla offset, limit og search ef ekkert var slegið inn
  let { offset = 0, limit = 10, search = null } = body;
  offset = Number(offset);
  limit = Number(limit);
  search = xss(search);

  if (search) {
    const withSpaceSearch = search.replace(/-/g, ' ');
    const values = [withSpaceSearch, offset, limit];
    const rows = await searchBooks(values);
    return makeResult(rows, 'books', offset, limit);
  }

  // skilyrði sem er sett aftast í query svo það þurfi ekki að gera of mörg query föll
  const conditions = 'OFFSET $1 LIMIT $2';
  // values send með í query
  const values = [offset, limit];

  let rows;
  if (table === 'users') {
    rows = await readUsers(conditions, values);
  } else {
    rows = await readAll(table, conditions, values);
  }

  return makeResult(rows, table, offset, limit);
}

module.exports = { getAll };
