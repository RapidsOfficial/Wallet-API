const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Address = require('./Address');

const tableName = 'wallets';


const Wallet = sequelize.define('Wallet', {
  walletId: {
    type: Sequelize.STRING,
    unique: true,
  },
  walletName:{
    type: Sequelize.STRING,
    unique:true,
  },
  nameForUI: {
    type: Sequelize.STRING,
  },
  network: {
    type: Sequelize.STRING
  },
  walletType: {
    type: Sequelize.STRING
  },
  mnemonic: {
    type: Sequelize.STRING
  }
}, {  tableName });



Wallet.hasMany(Address, {as: 'addresses'});

Wallet.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Wallet;
