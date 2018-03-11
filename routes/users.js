const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/:id', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/me', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/me/profile', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/:id/read', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/me/read', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

router.get('/me/read/:id', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

module.exports = router;
