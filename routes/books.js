const express = require('express');
const { requireAuthentication } = require('../authenticate');
const {
  createBook,
  readAll,
  update,
} = require('../db/queries');

const { getAll } = require('../db/utils');

const router = express.Router();


// Fall sem kallar á getAll til að sækja bækur
async function booksRoute(req, res) {
  const result = await getAll(req, 'books');
  return res.json(result);
}

// Sækir eina bók með id
async function bookById(req, res) {
  const { id } = req.params;

  // skilyrðið aftast í queri-ið
  const conditions = 'WHERE id = $1';
  const book = await readAll('books', conditions, [id]);

  // Ath hvort til sé bók með þessu id
  if (book[0]) {
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
router.get('/:id', catchErrors(bookById));
router.patch('/:id', requireAuthentication, catchErrors(patchRoute));

module.exports = router;
