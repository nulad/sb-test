var Sequelize = require('sequelize');
var config = require('../../config');

var sequelize = new Sequelize('db-name', 'username', 'pass', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models
db.Stocks = require('./stocks.js')(sequelize, Sequelize);

module.exports = db;
