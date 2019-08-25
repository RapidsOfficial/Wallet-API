// Import the wallet libraries
const { Wallet } = require('@dashevo/wallet-lib');
const DAPIClient  = require('@dashevo/dapi-client');
const { Mnemonic } = require('@dashevo/dashcore-lib');
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const uuidv4 = require('uuid/v4');

const mnemonic = new Mnemonic(); //Can also be an instance of Mnemonic
const network = 'livenet' // or 'livenet'
const transport = new DAPIClient({
  seeds: [{
    service: '0.0.0.0:30002',
    port:3000
  }],
});

const WalletController = () => {
  const createWallet = async (req, res) => {
    const { body } = req;
    if (body.walletName) {
      try {
        const opts = {
            transport, mnemonic, network
          };
        const wallet = new Wallet(opts);
        walletId = wallet.walletId + '-' + uuidv4();
        const account = wallet.createAccount();
        const getac = wallet.getAccount({index:0});
        const addresses = account.getAddresses();
        const walletUser = await WalletModel.create({
          walletId: walletId,
          network: wallet.network.name,
          walletType: wallet.walletType,
          mnemonic: wallet.mnemonic,
          privateKey: wallet.HDPrivateKey.toString(),
          addresses: {
              address:addresses,
              network:'livenet'
          }
        }, {
          include: [{ model: Address,
                    as: 'addresses'}]
        });
        wallet.disconnect();
        account.disconnect()
        return res.status(200).json({ walletUser });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Wallet name is must' });
  };

  const setAddress = async(walletUser, address) => {
    walletUser.setAddresses({
      address: address,
      network: 'livenet'
    })
  }

  return {
    createWallet
  };
};

module.exports = WalletController;
