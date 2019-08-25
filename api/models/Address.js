
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Wallet = require('./Wallet');
const tableName = 'addresses';


const Address = sequelize.define('Addresses', {
  network: {
    type: Sequelize.STRING
  },
  address:{
    type: Sequelize.JSON
  }
}, {  tableName });


Address.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};
module.exports = Address;
