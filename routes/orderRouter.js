const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthorized } = require('../middleware/auth');

router.post('/placeOrder', isAuthorized, orderController.placeOrder);
router.put('/cancelOrder/:orderId', isAuthorized, orderController.cancelOrder);
router.delete('/deleteOrder/:orderId', isAuthorized, orderController.deleteOrder);
router.get('/orderProgress/:orderId', isAuthorized, orderController.checkOrderProgress);
router.put('/updateOrderStatus/:orderId', isAuthorized, orderController.updateOrderStatus);

module.exports = router;