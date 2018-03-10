const express = require('express');
const users = require('../db/queries');
const auth = require('../authenticate');

const router = express.Router();


router.get('/', function(req,res,next) {

});

router.post('/register', function(req, res, next) {

});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findByUsername(username);
  req.id = user.id; // Flýtur þá með inn í giveToken..

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await auth.comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    auth.giveToken(req, res); // fall sem mun skila token
  }

  return res.status(401).json({ error: 'Invalid password' });
});


module.exports = router;
