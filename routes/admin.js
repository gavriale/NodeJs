const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminController = require('../controllers/admin');

/**
 * router with registered routes get and post, exported from this file.
 */
const router = express.Router();

/**
 * the get router goes to the productsController in the controllers folder.
 */
// /admin/products => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products',adminController.getProducts);

// /admin/products => POST
router.post('/add-product', adminController.postAddProduct);

//router.post('/products',adminController.postDeleteProduct);

router.get('/edit-product/:productId',adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);


exports.routes = router;
