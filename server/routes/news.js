const express = require('express');
const {
  getNewsArticles,
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getAllArticlesForAdmin,
} = require('../controllers/news');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getNewsArticles);
router.get('/:articleId', getNewsArticleById);

// Protected routes (Admin/SuperAdmin only)
router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPERADMIN']));

router.get('/admin/all', getAllArticlesForAdmin);
router.post('/', createNewsArticle);
router.put('/:articleId', updateNewsArticle);
router.delete('/:articleId', deleteNewsArticle);

module.exports = router;