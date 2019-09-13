// Import the wallet libraries
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const uuidv4 = require('uuid/v4');
const bitcore = require('bitcore-lib');
const Client = require('bitcoin-core');

// We create a client

const client = new Client( { network:'mainnet', port: 8332, username:'dashrpc', password:'password',  host: '0.0.0.0'} )



const network = 'livenet' // or 'livenet'

let globalAccount;

const WalletController = () => {
  const createWallet = async (req, res) => {
    const { body } = req;
    if (body.walletName) {
      try {

        const walletId = uuidv4() + '-' + body.walletName;
        const name = walletId + body.walletName;
        const privateKey = new bitcore.PrivateKey();
        const pubKey = privateKey.toPublicKey();
        const address = pubKey.toAddress(bitcore.Networks.livenet);

        const walletUser = await WalletModel.create({
          walletId: walletId,
          walletName: name,
          network: 'livenet',
          walletType: 'privateKey',
          mnemonic: '',
          privateKey: privateKey.toString(),
          addresses: {
              address:address.toString(),
              network:'livenet'
          }
        }, {
          include: [{ model: Address,
                    as: 'addresses'}]
        });
        // sending the walletAddress to be underWatch from CLI
        await importAddress(address.toString(), name)
        return res.status(200).json({ walletUser });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Wallet name is must' });
  };


  const check = async() => {
    client.getInfo().then((info) => {
      if (info.version == 1000001){
        return true
      } else {
        return false;
      }
    }).catch(error => {
      return error;
    })

  }
  const importAddress = async (address, name) => {

    await client.importAddress(address, name, true).then((resp) => {
        console.log('Address has been imported');
      }).catch(error => {
        console.log('Address has not been imported', error)
        return error;
      })

  }

  return {
    createWallet
  };
};

module.exports = WalletController;
