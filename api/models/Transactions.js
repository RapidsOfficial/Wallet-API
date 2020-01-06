
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Wallet = require('./Wallet');

const tableName = 'transactions';


const Transactions = sequelize.define('Transactions', {
  walletId: {
    type: Sequelize.STRING,
  },
  fromAddress: {
    type: Sequelize.STRING,
  },
  toAddress: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.STRING,
  },
  fees: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING,
  },
  timestamp:{
    type: Sequelize.DATE,
  },
  trxId: {
    type: Sequelize.STRING,
  }

}, { tableName });


Transactions.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};
module.exports = Transactions;
