

const Product = require('../models/product');


/**
 * 
 * @param {*} req - go to Add product
 * @param {*} res - returns html/pug associated to the route
 * @param {*} next - calling to the next middleware function in line
 */
 exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing:false
    });
  };


exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    /**
     * Sequelize works with promises, so here we can chain then and we can chain catch
     */
    
    console.log(req.user);
    req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(result => {
      //console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });

/*
    Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      //userId was added as a db field because we have a relation set up
      //req.user is a sequelize object which holds both the db data for user and the sequelize methods
      userId: req.user.id,
    })
    //@param onfulfilled — The callback to execute when the Promise is resolved.
    .then(result => {
      //console.log(result);
      console.log('Created Product');
    })
     
    //Attaches a callback for only the rejection of the Promise.
    //@param onrejected — The callback to execute when the Promise is rejected.
    //@returns — A Promise for the completion of the callback.
    .catch(err => {
      console.log(err);
    });
    
*/

    /**
     * save method of product object that saves a new instance of product to the database
     * Now instead of using the save method we are now getting a sequelize object from the
     * product model, and we can use the methods of sequelize
     */
    /*
    const product = new Product(null,title,imageUrl,description,price);
    product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));                                                                                        
    res.redirect('/');
    */
}

/**
 * req.params contains route parameters (in the path portion of the URL), 
 * and req.query contains the URL query parameters (after the ? in the URL).
 */

 exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(req.query);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({
    //here we get back an array even if it holds only one element  
    where: {
        id: prodId
      }
  })
  //Product.findByPk(prodId)
  .then(products => {
    //if there is no product redirect to home page
    const product = products[0];
    if (!product) {
      res.redirect('/');   
    }
    //otherwise render the view with our loaded product
    /**
     * 1.If there is a product that is edited, send a response for the user request =>
     * 2.In the response render the view admin/edit-product from views folder - This is the frontend
     * 3.pass the editMode in the response so the ejs code will use it!
     * 4.Then from here the response sent and in the ejs file it shows the client the view according
     * to the response from here
     * The request body look like this : http://localhost:3000/admin/edit-product/1?edit=true
     */
    res.render('admin/edit-product',{
      pageTitle:'Edit Product',
      path:'/admin/edit-product',
      editing:editMode,
      product: product
    });
  })
  .catch(err => {
     console.log(err);
  })
};

exports.postEditProduct = (req,res,next) => {

  //fetch the product
  //create new product instance and populate it with the information
  //and then we need to call the save method

  /**
   * because it's a POST request I expect to get the needed information from 
   * the request body
   */
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.imageUrl = updatedimageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    /**
     * Before using the product.save method it will be updated locally on our app but not in the 
     * database. After using the save method provided by sequelize(remember that product is a
     * sequelize object), and save takes the product and saves it in the database, if the product
     * does not exist yet it will create a new one, but if it does then it will override/update the
     * old one with our new values.
     * 
     * in the end we put a return before product.save(), and because we return here a promise,
     * we can make a 'then' again

     */
    return product.save();
  })
  .then(result => {
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  })

}

exports.getProducts = (req,res,next) => {
    //Product.findAll()
    req.user.getProducts()
    .then(products => {
      res.render('admin/products',{
        prods:products,
        pageTitle: 'Admin Products',
        path:'/admin/products'
      });
    })
    .catch(err => {
      console.log(err)});
    };



exports.postDeleteProduct = (req,res,next) => {

  //get the product id from the request body
  const prodId = req.body.productId;

  /**
   * remove the product from the products...
   * destroy allows us to destroy every object we find, for example with a where condition\
   * we can remove rows with certain attributes values
   * */
  
  /* this is one way of doing it
  Product.destroy({
    where: {
      id: prodId
    }
  });
  res.redirect('/admin/products');
  */
//Second way:
Product.findByPk(prodId)
.then(product => {
  //return a promise to the next then function
  return product.destroy();
})
.then(result => {
  console.log('Object Removed!');
  res.redirect('/admin/products');
})
.catch(err => {
  console.log(err);
})

}
