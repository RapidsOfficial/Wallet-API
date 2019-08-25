// Import the wallet libraries
const { Wallet } = require('@dashevo/wallet-lib');
const DAPIClient  = require('@dashevo/dapi-client');
const { Mnemonic } = require('@dashevo/dashcore-lib');
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const uuidv4 = require('uuid/v4');
const COIN = 100000000;
const network = 'livenet' // or 'livenet'
const transport = new DAPIClient({
  seeds: [{
    service: '0.0.0.0:30002',
    port:3000
  }],
});

const Transactions = () => {
  const createTransaction = async (req, res) => {
    const { body } = req;
    if (body.walletId && body.amount && body.recipient) {
      try {
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId
          }
        })

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);

        mnemonic = cal[0].mnemonic;
        privateKey = cal[0].privateKey;
        privateKeys = [];
        privateKeys.push(privateKey);

        opts = {
          transport, network, mnemonic, privateKey
        }
        const wallet = new Wallet(opts);

        const account = wallet.getAccount({index:2});
        const utxos = account.getUTXOS();

        // Create Transactions
        money = body.amount;
        toSend = body.recipient;
        satoshi = body.amount * COIN;
        optsForTransaction = {
          amnount: money,
          satoshis: satoshi,
          recipient: toSend,
          privateKeys: privateKeys

        }

        const rawTx = account.createTransaction(optsForTransaction);

        const txId = account.broadcastTransaction(rawTx);
        const data = rawTx.toString();
        const id = txId;

        wallet.disconnect();
        account.disconnect()
        return res.status(200).json({ data , id});
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Fields missing is required' });
  };

  const getTransaction = async (req, res) => {
    const { body } = req;
    console.log(req.params);
    if (body.walletId && req.params.id) {
      try {
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId
          }
        })

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);

        mnemonic = cal[0].mnemonic;
        privateKey = cal[0].privateKey;
        privateKeys = [];
        privateKeys.push(privateKey);

        opts = {
          transport, network, mnemonic, privateKey
        }
        const wallet = new Wallet(opts);

        const account = wallet.getAccount({index:2});

        // Create Transactions
        const tx = account.getTransaction(req.params.id);

        wallet.disconnect();
        account.disconnect()
        return res.status(200).json({ tx });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Fields missing is required' });
  };



  return {
    createTransaction,
    getTransaction
  };
};

module.exports = Transactions;
