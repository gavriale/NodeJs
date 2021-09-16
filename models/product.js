

const {Sequelize} = require('sequelize');

/**
 * my database connection pool which is more then a connection pool, it's a fully configured
 * sequelize envoirment, which has also the connection pool and all the features of the sequelize
 * package.
 * 
 */
const sequelize = require('../util/database');

/**
 * this is our product model, and we need to export it. We create new model by using the define method
 * the first argument is the module name and its typically a lowercase name in this case 'product'
 * 
 * The second argument defines the structure of our module, and therefore also the automatic created
 * db table, this will be a js object and there we simply define the object attributes/fields our
 * product should have
 */
const Product = sequelize.define('product',{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    title: Sequelize.STRING,
    
    price: {
       type: Sequelize.DOUBLE,
       allowNull:false
    },

    imageUrl:{
        type: Sequelize.STRING,
        allowNull:false
    },

    description:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Product;

/*

const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product{

    constructor(id,title,imageUrl,description,price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){ 
      
      return db.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)',
      [this.title,this.price,this.description,this.imageUrl]
      );
    }
 
    static fetchAll(){
      return db.execute('SELECT * FROM products');
    }

    static findById(id,cb){
        return db.execute('SELECT * FROM products WHERE products.id=?',[id]);
    }

}
*/
