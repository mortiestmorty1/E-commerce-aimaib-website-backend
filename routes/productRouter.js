const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAuthorized = require('../middleware/auth');

router.get('/getProducts', productController.getProducts);
router.post('/addProduct',isAuthorized, productController.addProduct);
router.put('/updateProduct/:id',isAuthorized, productController.updateProduct);
router.delete('/deleteProduct/:id',isAuthorized, productController.deleteProduct);
router.get('/getProductById/:id', productController.getProductById);

module.exports = router;


