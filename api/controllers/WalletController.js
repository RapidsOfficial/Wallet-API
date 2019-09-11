// Import the wallet libraries
const { Wallet, EVENTS } = require('@dashevo/wallet-lib');
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
let globalAccount;

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
        const getac = wallet.getAccount();
        globalAccount = getac;
        const addresses = account.getUnusedAddress().address;

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
        await events(getac);
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

  const start = async() => {

    const confirmedBalance = await globalAccount.getConfirmedBalance(false);
    const unConfirmed = await globalAccount.getUnconfirmedBalance(false);
    const address = await globalAccount.getUnusedAddress().address;

    return data = {
      confirmedBalance, unConfirmed, address
    }

  };

  const events = async() => {
    account = globalAccount;
    account.events.on(EVENTS.GENERATED_ADDRESS, (info) => { console.log('GENERATED_ADDRESS'); });
    account.events.on(EVENTS.CONFIRMED_BALANCE_CHANGED, (info) => { console.log('CONFIRMED_BALANCE_CHANGED', info, info.delta); });
    account.events.on(EVENTS.UNCONFIRMED_BALANCE_CHANGED, (info) => { console.log('UNCONFIRMED_BALANCE_CHANGED', info); });
    account.events.on(EVENTS.READY, start);
    account.events.on(EVENTS.BLOCKHEIGHT_CHANGED, info => console.log('BLOCKHEIGHT_CHANGED:', info));
    account.events.on(EVENTS.PREFETCHED, () => { console.log(EVENTS.PREFETCHED); });
    account.events.on(EVENTS.DISCOVERY_STARTED, () => console.log(EVENTS.PREFETCHED));


  }




  return {
    createWallet
  };
};

module.exports = WalletController;
