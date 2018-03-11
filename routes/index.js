const express = require('express');
const users = require('../db/queries');
const { comparePasswords, giveToken } = require('../authenticate');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.json({ error: 'þetta þarf ekki?' });
});

router.post('/register', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findByUsername(username);
  req.id = user.id; // Flýtur þá með inn í giveToken..

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    giveToken(req, res); // fall sem mun skila token
  }

  return res.status(401).json({ error: 'Invalid password' });
});


module.exports = router;
