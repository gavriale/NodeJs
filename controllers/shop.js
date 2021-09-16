
/**
 * Product is now a sequelize model, the sequelize model have no fetchAll method, but
 * he has a findAll method -> the findAll returns back a promise where we can use the 
 * result
 */
const Product = require('../models/product');
/**
 * Just like a cart related to user, so is an order, an order doesnt exist without a user
 * So we dont need this import just like we dont need a cart import
 */
//const Order = require('../models/order');


exports.getIndex = (req,res,next) => {

  Product.findAll() 
  .then(products => {  
    res.render('shop/index',{
      prods:products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  });

}

/**
     * inside fetchAll(cb) - the fetchAll uses the function cb with the products as an argument and 
     * and then here when going to the html/pug/ejs it uses the products argument
     */
exports.getProducts = (req, res, next) => {

  Product.findAll()
  .then(products => {
    res.render('shop/product-list',{
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
    });
  })
  .catch(err => {
    console.log(err)})
  
};

exports.getProduct = (req,res,next) => {

    const prodId =  req.params.productId;
    console.log(req.params);
    /**
     * The option of using where in the findAll method gives us by default an array,
     * even though we know that only one product will have this id, findAll always gives
     * you multiple items even if it is an array with only 1 element
     */
    /*
    Product.findAll({
      where:{
        id:prodId
      }
    })
    .then(products =>{
      res.render('shop/product-detail',{
        product: products[0],
        pageTitle: 'product',
        path: '/products'
      });
      
    })
    .catch(err => {
      console.log(err);
    });
    */
   
    Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail',{
        product: product,
        pageTitle: product.title,
        path: 'products'
      });
    })
    .catch(err => {
      console.log(err);
    });
    

    /**
     * in 'then' function we get our product in the end => 
     * To be precise we got the nested array, where we know
     * that the first element will be all the rows we got, in our case it will be just 1 row =>
     * the row of our product
     * 
     * With Sequelize we dont get an array of products, instead we get a single product
     */
    
};
     

/**
 * Now we changed the cart model, cart is now a sequelize object that also have relations
 * defined in app.js :
 * User.hasOne(Cart);
 * Cart.belongsTo(User);
 * Cart.belongsToMany(Product,{through: CartItem});
 * Product.belongsToMany(Cart,{through: CartItem});
 */

/**
 * getCart exported, then used in the routes with this : 
 * router.get('/cart',shopController.getCart);
 * When there is a get request, and the route is /cart, then it goes to the get/post according to the
 * route, and there it goes to the listener function in the controllers.
 * 
 * And this listener get a req object,a res object that is built in the method and next
 * It passes control to the next matching route
 * 
 */
exports.getCart = (req,res,next) => {
  req.user.getCart()
  .then(cart => {
    //console.log(cart);
    //this method is added by sequelize and it will look in the in between table cart-item
    return cart.getProducts();
  })
  //now here we got the products and we want to render them!
  .then(products => {
    res.render('shop/cart',{
      pageTitle: 'Your Cart',
      path: '/cart',
      products: products
    });
  })
  .catch(err => {
    console.log(err);
  });

};
/**
 * postCart method is responsibole for adding new products to the cart
 */
 exports.postCart = (req, res, next) => {

  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  

  req.user.getCart()
    /*
    after getting the cart attached to the user,because every user has a cart, we are getting
    a cart from the magic method getCart() that sequelize generates for us.
    then we return a promise => An array of products, with one product only because id is 
    a primary key
    */
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    /*
    then block getting products array
    */
    .then(products => {
      let product;
      //if array has length then the product exists in the array already
      if (products.length > 0) {
        //pull the product from products[0] 
        product = products[0];
      }
      //if we have a product, product not null, we entered the if above
      if (product) {
        //product is a cart-item, pull the old quantity attached to the cart-item
        const oldQuantity = product.cartItem.quantity;
        //update the quantity
        newQuantity = oldQuantity + 1;
        //here we have done, it's time to return the product after we changed it
        return product;
      }
      //if we are here the product isn't in the cart, return the product from product table
      return Product.findByPk(prodId);
    })
    //addProduct is another magic method provided by Sequelize and the relations between models
    //Its added to the in between table, in the in between table of cart-item we have the quantity field
    .then(product => {
      //Telling Sequelize for this in between table here additional info you need to set the values
      //in there, and there we are setting the keys/fields to be set in the in between table
      //in our case we need the quantity field to be updated and this is what we are passing
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

  /*
  const productId = req.body.productId;
  console.log(productId);
  Product.findById(productId,(product) => {
    Cart.addProduct(productId,product.price);
  });
  res.redirect('/cart');
  */


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({
      where: {id:prodId}
    });
  })
  .then(products => {
    const product = products[0];
    //now we want to destroy that product but only in the in between table
    //not in the products table of course but only in cart-item table
    //this line will remove the item from the cart-item table
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => {
    console.log(err);
  })
};

//take all the cart-items and move them into an order
exports.postOrder = (req,res,next) => {
  //req.user is added on the request object
  //user has one cart, get this cart
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    //get products from cart - another method from the relations
    //Cart.belongsToMany(Product,{through: CartItem});
    //Product.belongsToMany(Cart,{through: CartItem});
    fetchedCart = cart;
    return cart.getProducts();
  })

  .then(products => {
    //req.user.createOrder() - a method we get from the relation 1:M between user to order
    //console.log(products);
    return req.user
      .createOrder()
      //order created take the result to the next then
      .then(order => {
        //The map() method creates a new array populated with the results of calling
        //a provided function on every element in the calling array.
        return order.addProducts(products.map(product => {   
          /**
           * Here we assign to a product object, which is a sequelize object a new property orderItem
           * The value assigned to this property is an js object with quantity field.
           * The value of quantity comes from product.cartItem.quantity
           * product.cartItem is available from the relations between them.
           * 
           * In other word, This adds a product to the order and also sets its quantity proprty
           * in the JOIN table.
           * 
           * Does sequelize "magically" construct and sace a complete "orderItem" model from this js
           * object when "order.addProducts()" is called?
           * 
           * Yes, it will take that orderItem property and see it mathes the name of the join table.
           * The properties in that orderItem object are then inserted into that table.
           * 
           * My explaination : product as cartItem field, we add another field to product and this is
           * orderItem : this object has one property -  the quantity of the current cartItem
           * cartItem has cartId,productId and a quantity in our database.
           */
          product.orderItem = { quantity:product.cartItem.quantity };
          //console.log(product);
          return product;
        }));
      })
      .catch(err =>{console.log(err)});
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err =>{console.log(err)})
};

exports.getOrders = (req,res,next) => {

  //getOrders - magic method
  req.user
  /**
   * if you are fetching all the orders please also fetch all related products already and give
   * me back one array of orders which also includes the products per order. This work because
   * we have a relation between orders and products set up in app.js.
   * 
   * Now each order will now have products array, with that in mind we go back to our orders view
   * and make it work
   */
  .getOrders({include: ['products']})
  .then(orders => {
    console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders: orders
    });
  })
  .catch(err =>{console.log(err)})
}

