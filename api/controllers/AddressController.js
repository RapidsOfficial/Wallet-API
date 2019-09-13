const WalletModel = require('../models/Wallet');
const Address = require('../models/Address');
const axios = require('axios');
const _ = require('lodash');

const network = 'livenet' // or 'testnet'

const explorerAPI = 'https://rapidsexplorer.com' // Change this to RapidsExplorer
let balance;
let account;


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


        // Get the stored adddress

        address = await Address.findAll({
          where: {
            walletId: cal[0].id
          }
        })

        addr = JSON.stringify(address)
        addres = JSON.parse(addr)

        address = addres[0].address
        await getBalance(address)
        return res.status(200).json({ balance });
      } catch (err) {
        return res.status(500).json({ msg: 'Internal server error' , err});
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Address field is must' });
  };


 /// I need to be able to fetch balance from the API

 const getBalance = async (address) => {
   pathAPI = explorerAPI + '/ext/getaddress/'+address
  await  axios.get(pathAPI).then(response => {
     console.log(response.data)
     if (_.isEmpty(response.data)){
        balance = {msg: "This address has not UTXO found"}
        return ({msg: "This address has not UTXO found"})
     } else {
       balance = response.data
       return response.data
     }

   })
   .catch(error => {
     console.log(error)
   })

 }


  return {
    getAddress
  };
};

module.exports = AddressController;
