const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware')

//customer routes
router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getById);

//admin routes
router.get('/', authMiddleware, orderController.getAll);
router.put('/:id/status', authMiddleware, orderController.updateStatus);

module.exports = router;