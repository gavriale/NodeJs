const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

/**
 * The get route used to diplay a new page
 */
router.get('/', shopController.getIndex);

router.get('/products',shopController.getProducts);

/**
 * here after the /products/ we have a dynamic segment => an id that changes depending on the product id
 * The express router supports us with this => we can tell the express router that there will be some variable
 * segment by adding a column and then any name of our choice 
 * The syntax : router.get('/products/:productId') later we will be able to extract that information by that name
 * after the ":" 
 * 
 * This ":" signals to express that it should not look for a route, and that the part after the / can be anything
 * 
 * if you have another route like this after this route =>
 */
router.get('/products/:productId',shopController.getProduct);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.post('/cart-delete-item',shopController.postCartDeleteProduct);

router.get('/orders',shopController.getOrders);

router.post('/create-order',shopController.postOrder);




module.exports = router;
