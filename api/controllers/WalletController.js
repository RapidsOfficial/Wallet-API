// Import the wallet libraries
const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const uuidv4 = require('uuid/v4');
const bitcore = require('rapids-lib');
const Client = require('bitcoin-core');
const Mnemonic = require('rapids-mnemonic');
const _ = require('lodash');
const morgan = require('morgan');
const Backup = require('../models/Backup');

// We create a client

const client = new Client({
  network: 'mainnet', port: 8332, username: 'dashrpc', password: 'password', host: '0.0.0.0',
});


const network = 'livenet'; // or 'livenet'

let globalAccount;

const WalletController = () => {
  const createWallet = async (req, res) => {
    const { body } = req;
    if (body.walletName) {
      try {
        const walletId = `${uuidv4()}-${body.walletName}`;
        const name = walletId + body.walletName;
        // WE GENERATE THE RANDOM WORDS HERE
        const code = new Mnemonic(Mnemonic.Words.ENGLISH);
        const privateKey = new bitcore.PrivateKey();
        const pubKey = privateKey.toPublicKey();
        const address = pubKey.toAddress(bitcore.Networks.livenet);
        const walletUser = await WalletModel.create({
          walletId,
          walletName: name,
          network: 'livenet',
          walletType: 'privateKey',
          mnemonic: code.toString(),
          privateKey: privateKey.toString(),
          addresses: {
            address: address.toString(),
            network: 'livenet',
          },
        }, {
          include: [{
            model: Address,
            as: 'addresses',
          }],
        });
        // sending the walletAddress to be underWatch from CLI
        await importAddress(address.toString(), name);
        return res.status(200).json({ walletUser });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Wallet name is must' });
  };

  const createBackup = async (req, res) => {
    const { body } = req;

    // Maybe we should check the backup wallet beforeEach request


    if (body.walletId && body.phrases && body.password) {
      // Check now
      try {
        // So it needs to fetch the information about the wallet match the phrase and then stores them.
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId,
          },
        });

        // Get converted data

        data = await conversions(walletFromDB);

        // Now it will use the above
        if (!_.isNull(data[0].backupId)) {
          return res.status(200).json({ msg: 'Wallet is already backed up' });
        }
        if (_.isEqual(data[0].mnemonic, body.phrases)) {
          const backup = await Backup.create({
            walletId: data[0].walletId,
            password: body.password,
            backedUp: true,
          });

          //  Now we write to wallet.update()
          conv = await conversions(backup);
          console.log('Here', conv);
          const update = await WalletModel.update({
            backupId: conv.id,
          }, {
            where: {
              walletId: data[0].walletId,
            },
          });
          return res.status(200).json({ true: true });
        }
        return res.status(400).json({ msg: 'Bad Request: Phrases does not match up' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Wallet ID and Phrases are must' });
  };


  const getBackupStatus = async (req, res) => {
    const { body } = req;

    // Maybe we should check the backup wallet beforeEach request


    if (body.walletId) {
      // Check now
      try {
        // So it needs to fetch the information about the wallet match the phrase and then stores them.
        const walletFromDB = await WalletModel.findAll({
          where: {
            walletId: body.walletId,
          },
        });

        // Get converted data

        data = await conversions(walletFromDB);

        // Now it will use the above
        if (!_.isNull(data[0].backupId)) {
          return res.status(200).json({ msg: 'Wallet is already backed up' });
        }
        return res.status(400).json({ msg: 'Wallet is not backed up' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Wallet ID is must' });
  };


  const conversions = async (obj) => {
    objects = JSON.stringify(obj);
    cal = JSON.parse(objects);
    return cal;
  };


  const check = async () => {
    client.getInfo().then((info) => {
      if (info.version == 1000001) {
        return true;
      }
      return false;
    }).catch((error) => error);
  };
  const importAddress = async (address, name) => {
    await client.importAddress(address, name, true).then((resp) => {
      console.log('Address has been imported');
    }).catch((error) => {
      console.log('Address has not been imported', error);
      return error;
    });
  };

  return {
    createWallet,
    createBackup,
    getBackupStatus,
  };
};

module.exports = WalletController;
