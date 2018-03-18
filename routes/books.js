const express = require('express');
const { requireAuthentication } = require('../authenticate');
const {
  createBook,
  readAll,
  readOne,
  update,
} = require('../db/queries');

const router = express.Router();


// Fall sem kallar á readAll til að sækja bækur
async function booksRoute(req, res) {
  // frumstilla offset og limit ef ekkert var slegið inn
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const rows = await readAll(offset, limit);

  const result = {
    links: {
      self: {
        href: `http://localhost:3000/books/?offset=${offset}&limit=${limit}`,
      },
    },
    limit,
    offset,
    items: rows,
  };

  // Ef þetta er ekki fyrsta síða, þá setjum við 'prev' síðu
  if (offset > 0) {
    result.links.prev = {
      href: `http://localhost:3000/books/?offset=${offset - limit}&limit=${limit}`,
    };
  }

  // Ef raðir færri en limit þá kemur ekki next síða
  if (!(rows.length < limit)) {
    result.links.next = {
      href: `http://localhost:3000/books/?offset=${Number(offset) + limit}&limit=${limit}`,
    };
  }

  return res.json(result);
}

// Sækir eina bók með id
async function bookRoute(req, res) {
  const { id } = req.params;

  const book = await readOne(id);

  // Ath hvort til sé bók með þessu id
  if (book) {
    return res.json(book);
  }

  return res.status(404).json({ error: 'Book not found' });
}

// Fall sem býr til bók
// TODO ákveða hvaða hlutir verða teknir inn (ekki gerð krafa um alla þessa)
async function createRoute(req, res) {
  const result = await createBook(req.body);

  if (!result.success) {
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

// Fall sem patch-ar (update-ar bók)
async function patchRoute(req, res) {
  const { id } = req.params;

  const result = await update(id, req.body);

  if (!result.success) {
    // Ef það var ekki hægt að patch-a því að bókin fannst ekki
    if (result.notfound) {
      return res.status(404).json({ error: 'Book not found' });
    }
    // Ef það var útaf validation villu
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', catchErrors(booksRoute));
router.post('/', catchErrors(createRoute));
router.get('/:id', catchErrors(bookRoute));
router.patch('/:id', requireAuthentication, catchErrors(patchRoute));

module.exports = router;
