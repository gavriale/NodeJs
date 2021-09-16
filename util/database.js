
/**import Sequelize, the capital S is used because we 
 * import a constructor function or class
 */
const {Sequelize} = require('sequelize');

/**
 * with that we create a new sequelize object, and we automatically connect to the database,
 * or to be precise it will set up connection pool just like we did it manually
 * Now we have got the connection set up, from here we need to work on the modules
 */
const sequelize = new Sequelize('node-complete','root','wevawewweva767',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;