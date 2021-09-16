
const Sequelize = require('sequelize');
const sequelize = require('../util/database');


/**
 * The products in the cart will come from the relations between cart and product
 * A Cart can belong to single user and can have multiple products
 * The carts table should hold different carts for different users
 */

const Cart = sequelize.define('cart',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;