const express = require('express');
const { login } = require('../authenticate');
const { createUser } = require('../db/queries');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function register(req, res) {
  const {
    username, name, password,
  } = req.body;

  const result = await createUser({ username, name, password });

  if (!result.success) {
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));


module.exports = router;
