const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../middlewares/upload.middleware');

//public route
router.get('/', productController.getAll);
router.get('/', productController.getById);

router.post('/:id/variants', authMiddleware, productController.addVariant);
router.get('/:id/variants', productController.getVariants);

//admin only routes
router.post('/', authMiddleware, productController.create);
router.put('/', authMiddleware, productController.update);
router.delete('/', authMiddleware, productController.deleteProduct);

router.post('/:id/images', authMiddleware, upload.single('image'), productController.uploadImage);

module.exports = router;
