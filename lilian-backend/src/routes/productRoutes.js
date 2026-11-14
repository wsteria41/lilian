const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/upload.middleware')

// Public
router.get('/', productController.getAll)
router.get('/:id', productController.getById)
router.get('/:id/variants', productController.getVariants)

// Admin only
router.post('/', authMiddleware, adminMiddleware, productController.create)
router.post('/:id/variants', authMiddleware, adminMiddleware, productController.addVariant)
router.post('/:id/images', authMiddleware, adminMiddleware, upload.single('image'), productController.uploadImage)

router.delete('/images/:imageId', authMiddleware, adminMiddleware, productController.deleteImage)
router.delete('/variants/:variantId', authMiddleware, adminMiddleware, productController.deleteVariant)

router.put('/:id', authMiddleware, adminMiddleware, productController.update)
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct)

module.exports = router