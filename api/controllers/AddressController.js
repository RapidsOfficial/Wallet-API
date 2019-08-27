const { Wallet,EVENTS, Account } = require('@dashevo/wallet-lib');

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

        const account = wallet.getAccount();



        const start = async () => {
              console.log('Balance Conf', await account.getConfirmedBalance(false));
              console.log('Balance Unconf', await account.getUnconfirmedBalance(false));
              console.log('New Addr', await account.getUnusedAddress().address);
              const unUsedAddresses = await account.getAddresses();
              const totalBalance = await account.getTotalBalance();
              const confirmedBalance = await account.getConfirmedBalance();
              const unconfirmedBalance = await account.getUnconfirmedBalance();
              //
              // const tx = account.createTransaction({recipient:'yhvXpqQjfN9S4j5mBKbxeGxiETJrrLETg5', amount:5.74});
              // console.log(tx.toString());
              // const bdc = await account.broadcastTransaction(tx.toString());
              // console.log(bdc)
            };
        account.events.on(EVENTS.GENERATED_ADDRESS, (info) => { console.log('GENERATED_ADDRESS'); });
        account.events.on(EVENTS.CONFIRMED_BALANCE_CHANGED, (info) => { console.log('CONFIRMED_BALANCE_CHANGED', info, info.delta); });
        account.events.on(EVENTS.UNCONFIRMED_BALANCE_CHANGED, (info) => { console.log('UNCONFIRMED_BALANCE_CHANGED', info); });
        account.events.on(EVENTS.READY, start);
        account.events.on(EVENTS.BLOCKHEIGHT_CHANGED, info => console.log('BLOCKHEIGHT_CHANGED:', info));
        account.events.on(EVENTS.PREFETCHED, () => { console.log(EVENTS.PREFETCHED); });
        account.events.on(EVENTS.DISCOVERY_STARTED, () => console.log(EVENTS.PREFETCHED));

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
