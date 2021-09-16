

const {Sequelize} = require('sequelize');

/**
 * This is our own sequelize object which holds the connection to the db from the util folder
 */
const sequelize = require('../util/database');

const User = sequelize.define('user',{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    }

});

module.exports = User;