const express = require('express');
const { requireAuthentication } = require('../authenticate');

const {
  patchMe,
  findById,
  updatePhoto,
  createReadBook,
  getReadBooks,
  readUsers,
} = require('../db/queries');
const { getAll } = require('../db/utils');

const router = express.Router();


function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function userById(req, res) {
  const { id } = req.params;

  const conditions = 'WHERE id = $1';
  const result = await readUsers(conditions, [id]);

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

// Fall sem kallar á readUsers til að lesa notendur
async function userRoute(req, res) {
  const result = await getAll(req.query, 'users');
  return res.json(result);
}

async function postBook(req, res) {
  const result = await createReadBook(req.body);

  if (!result.success) {
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

async function userBooks(req, res) {
  const { id } = req.params;

  let result;
  if (id === 'me') {
    result = await getReadBooks(req.user[0].id);
  } else {
    result = await getReadBooks(id);
  }

  if (result.error) {
    return res.status(400).json(result.error);
  }

  return res.status(200).json(result);
}


router.get('/:id', requireAuthentication, isItMe, catchErrors(userById));
router.get('/', requireAuthentication, catchErrors(userRoute));


router.post('/me/profile', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/:id/read', requireAuthentication, userBooks);

router.post('/me/read', requireAuthentication, postBook);


router.delete('/me/read/:id', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

module.exports = router;
