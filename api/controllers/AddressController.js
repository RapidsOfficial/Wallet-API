const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const axios = require('axios');
const _ = require('lodash');
const bitcore = require('rapids-lib');

const network = 'livenet'; // or 'testnet'

const explorerAPI = 'https://rapidsexplorer.com'; // Change this to RapidsExplorer
let balance;
let account;


const AddressController = () => {
  const getAddress = async (req, res) => {
    const { body, query } = req;
    const walletId = body.walletId || query.walletId;
    if (walletId) {
      try {
        // Get walletId from the db clean it
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId,
          },
        });

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);


        // Get the stored adddress

        address = await Address.findAll({
          where: {
            walletId: cal[0].id,
          },
        });

        addr = JSON.stringify(address);
        addres = JSON.parse(addr);

        address = addres[0].address;
        await getBalance(address);
        return res.status(200).json({ balance });
      } catch (err) {
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }
    return res.status(400).json({ msg: 'Bad Request: Address field is must' });
  };

  const generateAddress = async (req, res) => {
    const { body, query } = req;
    const walletId = body.walletId || query.walletId;
    if (walletId) {
      try {
        // We get wallet
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId,
          },
        });

        data = await conversions(walletFromDB);
        console.log(data[0].id)
        // We need to fetch the private key and generate public address
        const privateKey = new bitcore.PrivateKey(data[0].privateKey);
        const pubKey = privateKey.toPublicKey();
        const address = pubKey.toAddress(bitcore.Networks.livenet);
        const rapidsAddress = address.toString();
        // Now we can save the address
      const dataToPost = await Address.create({
          network: 'livenet',
          address: address.toString(),
          WalletId: data[0].id,
        });
        return res.status(200).json({ rapidsAddress });
      } catch (err) {
        return res.status(500).json({ msg: 'Internal Server Error', err });
      }
    }
    return res.status(400).json({ msg: 'Bad Request: Wallet Id field is must' });
  };

  // / I need to be able to fetch balance from the API

  const getBalance = async (address) => {
    pathAPI = `${explorerAPI}/ext/getaddress/${address}`;
    await axios.get(pathAPI).then((response) => {
      console.log(response.data);
      if (_.isEmpty(response.data)) {
        balance = { msg: 'This address has not UTXO found' };
        return ({ msg: 'This address has not UTXO found' });
      }
      balance = response.data;
      return response.data;
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const conversions = async (obj) => {
    objects = JSON.stringify(obj);
    cal = JSON.parse(objects);
    return cal;
  };


  return {
    getAddress,
    generateAddress
  };
};

module.exports = AddressController;
