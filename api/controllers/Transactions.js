// Import the wallet libraries
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const uuidv4 = require('uuid/v4');

const COIN = 100000000;
const Client = require('bitcoin-core');
const bitcore = require('rapids-lib');

// We create a client

const client = new Client({
  network: 'mainnet', port: 8332, username: 'dashrpc', password: 'password', host: '0.0.0.0',
});

let utxos;
const network = 'livenet'; // or 'livenet'
let returnData;
let transactionsData;
const Transactions = () => {
  const createTransaction = async (req, res) => {
    const { body } = req;
    if (body.walletId && body.amount && body.recipient) {
      try {
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId,
          },
        });

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);

        privateKey = cal[0].privateKey;
        address = await Address.findAll({
          where: {
            walletId: cal[0].id,
          },
        });

        addr = JSON.stringify(address);
        addres = JSON.parse(addr);

        address = addres[0].address;

        await getUtxos(address);
        const privateKeys = [];
        privateKeys.push(privateKey);
        // Create Transactions
        money = body.amount;
        toSend = body.recipient;
        satoshi = body.amount * COIN;
        optsForTransaction = {
          amnount: money,
          satoshis: satoshi,
          recipient: toSend,
          privateKeys,
          utxos,
        };
        const rawTx = new bitcore.Transaction()
          .from(utxos)
          .to(toSend, satoshi)
          .change(address)
          .sign(privateKey);


        await sendRawTransaction(rawTx.toString());
        // Since this is a send transactions we store this in the databse

        return res.status(200).json({ returnData });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Fields missing is required' });
  };

  const recieveTransactionsUpdate = async (req, res) => {
    if (req.params.transactionsID) {
      try {
        // First we fetch transactions data
        await getTrx(req.params.transactionsID);
        // Send for notifications
        console.log(transactionsData);
      } catch (err){
        console.log(err);
      }
    }
  }


  const getTransaction = async (req, res) => {
    const { body } = req;
    if (body.walletId && req.params.id) {
      try {
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId,
          },
        });

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);

        mnemonic = cal[0].mnemonic;
        privateKey = cal[0].privateKey;
        privateKeys = [];
        privateKeys.push(privateKey);

        opts = {
          transport, network, mnemonic, privateKey,
        };
        const wallet = new Wallet(opts);

        const account = wallet.getAccount({ index: 2 });

        // Create Transactions
        const tx = account.getTransaction(req.params.id);

        wallet.disconnect();
        account.disconnect();
        return res.status(200).json({ tx });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Fields missing is required' });
  };




  const getUtxos = async (address) => {
    await client.listUnspent(0, 9999999, [address], 2).then((resp) => {
      utxos = resp;
      return resp;
    }).catch((error) => {
      console.log(error);
      return error;
    });
  };

  // const decodeTransactions = aysnc(hex) => {
  //   await client.getTransaction
  // }

  const sendRawTransaction = async (hex) => {
    await client.sendRawTransaction(hex).then((resp) => {
      returnData = resp;
      return resp;
    }).catch((error) => {
      console.log(error);
      returnData = resp;
      return error;
    });
  };

  const getTrx = async (trxId) => {
    await client.getTransaction(trxId).then((resp) => {
      transactionsData = resp;
      return resp;
    }).catch((error) => {
      console.log(error);
      return error;
    });
  };


  return {
    createTransaction,
    getTransaction,
    recieveTransactionsUpdate
  };
};

module.exports = Transactions;
