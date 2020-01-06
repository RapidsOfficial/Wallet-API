const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Address = require('./Address');
const Backup = require('./Backup');
const Transactions = require('./Transactions');

const tableName = 'wallets';


const Wallet = sequelize.define('Wallet', {
  walletId: {
    type: Sequelize.STRING,
    unique: true,
  },
  walletName: {
    type: Sequelize.STRING,
    unique: true,
  },
  nameForUI: {
    type: Sequelize.STRING,
    unique: true,
  },
  network: {
    type: Sequelize.STRING,
  },
  walletType: {
    type: Sequelize.STRING,
  },
  mnemonic: {
    type: Sequelize.STRING,
  },
  privateKey: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  colorCode: {
    type: Sequelize.STRING,
  },
  backupId: {
    type: Sequelize.INTEGER,
  },
}, { tableName });


Wallet.hasMany(Address, { as: 'addresses' });
Backup.hasOne(Wallet, { as: 'backup' });

Wallet.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Wallet;
