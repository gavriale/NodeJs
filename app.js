
/**
 * Flow of the program =>
 * 1.in app.js the app as registered listeners and the app always running 
 * waiting for the listeners to be triggered
 * 
 * In the app.js we want to ensure that all our modules get tables that belong to them whenever we
 * start our application, if the table already exists it will not override it by default, though we can
 * do it.
 */


const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database')

const app = express();
app.set('view engine','ejs');
app.set('views','views');

const error = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');



/**
 * then and catch this are functions that chained on the result of the execute call
 * So they will execute on whatever the execute gives us back.
 * A promise is a basic javascript object, which allows us to work with async code.
 */
/*
db.execute('SELECT * FROM products')
.then(rows => {console.log(rows)})
.catch( err => {console.log(err)});
*/

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{

    User.findByPk(1)
    .then(user => {
        //the user we retrieve from the database is not just a js object with values
        //It is a Sequelize Object that stored in the database, and now we store in on the request
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })


});

/**
 * listener of routes that start with /admin. second argument is the adminRoutes
 */
app.use('/admin', adminRoutes.routes);

app.use(shopRoutes);

app.use(error.errorMessage404);

/**
 * towards the end of the file I want to call sequelize and to use a special method called the 
 * sync method - the sync method look at all the modules we defined
 * 
 * Keep in mind --> You define your modules in your models file by calling sequelize.define on 
 * that same sequelize object, so it aware of all our modules and then creates tables for them
 * 
 * sync syncs the modules to the database by creating the apropriate tables, and if you have them - 
 * relations.
 */

/*User created the product, so the product belongs to the user*/
//onDelete: 'CASCADE' means that if we delete a user then the products of the user deleted also
Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
//user is source, cart is target, cart dont exist without user, foreign key defined in cart table
User.hasOne(Cart);
Cart.belongsTo(User);
/**
 * One cart can hold multiple products. 
 * The through key telling sequelize where this connections should be stored, In our case
 * it is stored in the CartItem model
 *  
 * */
Cart.belongsToMany(Product,{through: CartItem});
//A single product can be part of multiple different carts
Product.belongsToMany(Cart,{through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);
/*
The A.belongsToMany(B, { through: 'C' }) association means that 
a Many-To-Many relationship exists between A and B, using table C as junction table,
which will have the foreign keys (aId and bId, for example). 
Sequelize will automatically create this model C (unless it already exists) 
and define the appropriate foreign keys on it.
*/
Order.belongsToMany(Product, {through: OrderItem});



/**
 * With the Relations above the sequelize.sync() method will initialize tables for our models, and also
 * it will define the relations in our database as we defined them here. 
 * 
 * The one problem that we have here is that we already created the product table, and therefore it will not
 * override it with the new infromation, we can ensure that it will by setting .sync({force: true})
 * In production we dont want to override our tables all the time but during development we want to reflect
 * the new changes and therefore set the force to true
 * 
 * In the workbench mysql --> In the products table we have also userId field, userId will be
 * Automatically populated by sequelize once we create products that are related to a user. 
 */

sequelize
    .sync()
    //.sync({force: true})
    .then(result =>{
        //console.log(result);
        return User.findByPk(1);
    })
    /**
     * this annonymous function below either returns a promise -> return User.create({ name:'max', email:'test@test.com'});
     * Or it returns just on Object if the user argument isnt null ->  return user;
     * 
     * We should always return the same! so we can chain a another then and do 
     * return Promise.resolve(user), technically we dont really need it because when we return
     * a object from a then block it will automatically wrapped into a new promise 
     */
    .then(user => {
        if(!user){
            //no user, the user returned is null - create one user
            return User.create({ name:'max', email:'test@test.com'});
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart(); 
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

