const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ error: 'ekki tilbuið' });
});

module.exports = router;
