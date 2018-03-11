const express = require('express');
const { requireAuthentication } = require('../authenticate');

const {
  readCategories,
  createCategory,
} = require('../db/queries');

const router = express.Router();


function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Fall sem kallar á readCategories til að sýna alla bóka flokka
async function categoriesRoute(req, res) {
  // frumstilla offset og limit ef ekkert var slegið inn
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);


  const rows = await readCategories(offset, limit);

  const result = {
    links: {
      self: {
        href: `http://localhost:3000/categories/?offset=${offset}&limit=${limit}`,
      },
    },
    limit,
    offset,
    items: rows,
  };

    // Ef þetta er ekki fyrsta síða, þá setjum við 'prev' síðu
  if (offset > 0) {
    result.links.prev = {
      href: `http://localhost:3000/categories/?offset=${offset - limit}&limit=${limit}`,
    };
  }

  // Ef raðir færri en limit þá kemur ekki next síða
  if (!(rows.length < limit)) {
    result.links.next = {
      href: `http://localhost:3000/categories/?offset=${Number(offset) + limit}&limit=${limit}`,
    };
  }

  return res.json(result);
}

// Fall sem býr til category
async function createRoute(req, res) {
  const { categoryName } = req.body;

  const result = await createCategory({ categoryName });

  if (!result.success) {
    return res.status(400).json(result.validation);
  }

  return res.status(201).json(result.item);
}

router.get('/', catchErrors(categoriesRoute));
router.post('/', requireAuthentication, catchErrors(createRoute));

module.exports = router;
