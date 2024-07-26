const express = require('express');
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/contents',
  contentController.getContents
);

router.post(
  '/contents',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['Admin', 'Creator']),
  contentController.createContent
);

router.put(
  '/contents/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['Admin', 'Creator']),
  contentController.updateContent
);

router.delete(
  '/contents/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['Admin']),
  contentController.deleteContent
);

module.exports = router;
