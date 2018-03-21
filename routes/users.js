const express = require('express');
const { requireAuthentication } = require('../utils/authenticate');
const multer = require('multer');

const {
  patchMe,
  createReadBook,
  getReadBooks,
  readUsers,
  updatePhoto,
  del,
} = require('../db/queries');
const { upload } = require('../db/cloud');
const { getAll } = require('../utils/utils');

const router = express.Router();
const uploads = multer();


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
  const result = await getAll(req, 'users');
  return res.json(result);
}

async function postBook(req, res) {
  const result = await createReadBook(req.user[0].id, req.body);

  if (!result.success) {
<<<<<<< HEAD
    const errorMsg = result.validation[0].error.code === '23503'
=======
    const errorMsg = result.validation.error.code === '23503'
>>>>>>> f83409bdcf3fdf617b9e9b801b7e4b020de9d8cf
      ? res.status(404).json({ error: 'Book id not found' })
      : res.status(400).json(result.validation);

    return errorMsg;
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

async function uploadImg(req, res) {
  const { file: { buffer } = {} } = req;

  const url = await upload(buffer);

  if (url.error) {
    res.json(url);
  }
  const { id } = req.user[0];
  const result = await updatePhoto(id, url);

  if (result.error) {
    return res.status(400).json(result.error);
  }

  return res.status(200).json(result);
}


async function deleteBook(req, res) {
  const result = await del(req.params.id, req);

  if (result.length === 0) {
    return res.status(404).json({ error: 'Book Not Found' });
  }

  if (result.error) {
    return res.status(400).json(result.error);
  }

  return res.status(200).json(result);
}

async function patchUser(req, res) {
  const result = await patchMe(req);

  if (!result.success) {
    const errorMsg = result.error
      ? res.status(400).json(result.error)
      : res.status(400).json(result.validation);
    return errorMsg;
  }

  return res.status(200).json(result.item);
}

router.get('/:id', requireAuthentication, isItMe, catchErrors(userById));
router.get('/', requireAuthentication, catchErrors(userRoute));
router.get('/:id/read', requireAuthentication, catchErrors(userBooks));
router.post('/me/read', requireAuthentication, catchErrors(postBook));
router.post('/me/profile', requireAuthentication, uploads.single('profile'), catchErrors(uploadImg));
router.delete('/me/read/:id', requireAuthentication, catchErrors(deleteBook));
router.patch('/me', requireAuthentication, catchErrors(patchUser));

module.exports = router;
