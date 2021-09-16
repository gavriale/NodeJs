
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

/**
 * An order is a in between table - between the user for which the order belongs and 
 * them muli
 */
const Order = sequelize.define('order',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;