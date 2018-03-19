const express = require('express');
const { requireAuthentication } = require('../authenticate');
const { getUsers, findById } = require('../db/queries');

const router = express.Router();

async function users(req, res) {
  const result = await getUsers();

  if (result.error) {
    return res.status(400).json(result.error);
  }

  return res.status(201).json(result);
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

/* GET users listing. */
router.get('/', requireAuthentication, users);

router.get('/:id', requireAuthentication, isItMe, userById);


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
