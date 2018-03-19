const express = require('express');
const { requireAuthentication } = require('../authenticate');

const {
  readUsers,
  findById,
  readMe,
  patchMe,
  updatePhoto,
} = require('../db/queries');

const router = express.Router();


function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function userById(req, res) {
  const { id } = req.params;

  const result = await findById(id);

  if (result.error) {
    return res.status(400).json(result.error);
  }
  // þarf að bæta 404 meðhöndlunina í app.js og breyta þessu svo
  if (result.length === 0) {
    return res.status(404).json({ error: `User id: ${id} not found` });
  }

  return res.status(200).json(result);
}

function isItMe(req, res, next) {
  const { id } = req.params;
  if (id === 'me') {
    const { user } = req;
    return res.status(200).json(user);
  }
  return next();
}

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

router.get('/:id', requireAuthentication, isItMe, userById);
router.get('/', requireAuthentication, catchErrors(userRoute));



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
