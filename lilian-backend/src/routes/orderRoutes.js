const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

//customer routes
router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getById);

//admin routes
router.get('/', authMiddleware, adminMiddleware, orderController.getAll);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus)

module.exports = router;