const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const { isAuthorized } = require('../middleware/auth');


router.get('/getProducts', productController.getAllProducts);
router.post('/addProduct',isAuthorized, productController.addProduct);
router.put('/updateProduct/:productId',isAuthorized, productController.updateProduct);
router.delete('/deleteProduct/:productId',isAuthorized, productController.deleteProduct);
router.get('/getProductById/:productId', productController.getProductById);

module.exports = router;



