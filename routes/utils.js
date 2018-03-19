const {
  readAll,
  readUsers,
} = require('../db/queries');

// fall sem les allt úr töflu (books, categories eða users)
async function getAll(q, table) {
  // frumstilla offset og limit ef ekkert var slegið inn
  let { offset = 0, limit = 10 } = q;
  offset = Number(offset);
  limit = Number(limit);

  let rows;
  if (table === 'users') {
    rows = await readUsers(offset, limit);
  } else {
    rows = await readAll(table, offset, limit);
  }

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

module.exports = { getAll };
