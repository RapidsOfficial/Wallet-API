const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Wallet = require('./Wallet');

const tableName = 'backup';


const Backup = sequelize.define('Backup', {
  walletId: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  backedUp: {
    type: Sequelize.BOOLEAN,
  },
}, { tableName });


Backup.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Backup;
