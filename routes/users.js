const express = require('express');

const {
  readUsers,
  readUser,
  readMe,
  patchMe,
  updatePhoto,
} = require('../db/queries');

const router = express.Router();

/**
 * Mjög líkt readAll fallinu í books.js
 * TODO gera fall sem bæði books.js og users.js geta kallað á með mism param,
 * jafnvel lika hægt að hafa sama gæja í readUsers sem er kallað á með params
 */
// Fall sem kallar á readUsers til að lesa notendur
async function userRoute(req, res) {
  // frumstilla offset og limit ef ekkert var slegið inn
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const rows = await readUsers(offset, limit);

  const result = {
    links: {
      self: {
        href: `http://localhost:3000/users/?offset=${offset}&limit=${limit}`,
      },
    },
    limit,
    offset,
    items: rows,
  };

  // Ef þetta er ekki fyrsta síða, þá setjum við 'prev' síðu
  if (offset > 0) {
    result.links.prev = {
      href: `http://localhost:3000/users/?offset=${offset - limit}&limit=${limit}`,
    };
  }

  // Ef raðir færri en limit þá kemur ekki next síða
  if (!(rows.length < limit)) {
    result.links.next = {
      href: `http://localhost:3000/users/?offset=${Number(offset) + limit}&limit=${limit}`,
    };
  }

  return res.json(result);
}

// Sækir einn user með id
async function userIDRoute(req, res) {
  const { id } = req.params;

  const user = await readUser(id);

  // Ath hvort til sé user með þetta id
  if (user) {
    return res.json(user);
  }

  return res.status(404).json({ error: 'User not found' });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* GET users listing. */
router.get('/', catchErrors(userRoute));
router.get('/:id', catchErrors(userIDRoute));

router.get('/me', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.post('/me/profile', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/:id/read', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/me/read', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.post('/me/read', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});


router.delete('/me/read/:id', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

module.exports = router;
