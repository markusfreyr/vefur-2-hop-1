const express = require('express');
const { requireAuthentication } = require('../authenticate');
const { createCategory } = require('../db/queries');
const { getAll } = require('../db/utils');

const router = express.Router();


function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Fall sem kallar á readCategories til að sýna alla bóka flokka
async function categoriesRoute(req, res) {
  const result = await getAll(req.query, 'categories');
  return res.json(result);
}

// Fall sem býr til category
async function createRoute(req, res) {
  const { name } = req.body;

  const result = await createCategory(name);

  if (!result.success) {
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

router.get('/', catchErrors(categoriesRoute));
router.post('/', requireAuthentication, catchErrors(createRoute));

module.exports = router;
