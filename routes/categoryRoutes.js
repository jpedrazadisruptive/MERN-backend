const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/categories',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['Admin']),
  categoryController.createCategory
);

router.get(
  '/categories',
  categoryController.getAllCategories
);

module.exports = router;
