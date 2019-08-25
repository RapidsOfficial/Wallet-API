const { Wallet, Account } = require('@dashevo/wallet-lib');

const DAPIClient  = require('@dashevo/dapi-client');
const { Mnemonic } = require('@dashevo/dashcore-lib');
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');


const network = 'livenet' // or 'testnet'
const transport = new DAPIClient({
  seeds: [{
    service: '0.0.0.0:30002',
    port:3000
  }],
});


const AddressController = () => {
  const getAddress = async (req, res) => {
    const { body } = req;
    if (body.walletId) {
      try {
        // Get walletId from the db clean it
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId
          }
        })

        objects = JSON.stringify(walletFromDB);
        cal = JSON.parse(objects);

        mnemonic = cal[0].mnemonic;
        privateKey = cal[0].privateKey;

        opts = {
          transport, network, mnemonic, privateKey
        }

        wallet = new Wallet(opts);
        // get accounts

        const account = wallet.getAccount({index:2});
        const unUsedAddresses = account.getAddresses();
        const totalBalance = account.getTotalBalance();
        const confirmedBalance = account.getConfirmedBalance();
        const unconfirmedBalance = account.getUnconfirmedBalance();
        wallet.disconnect();
        account.disconnect()
        return res.status(200).json({ totalBalance,confirmedBalance ,  unconfirmedBalance, unUsedAddresses });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Address field is must' });
  };

  return {
    getAddress
  };
};

module.exports = AddressController;
