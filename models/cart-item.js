
const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const CartItem = sequelize.define('cartItem',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  //Each cart-item is a combination of a product and the id of the cart in which this product lies and the quantity
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;