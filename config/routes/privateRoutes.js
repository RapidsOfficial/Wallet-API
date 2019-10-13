const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'POST /wallet': 'WalletController.createWallet',
  'GET /address': 'AddressController.getAddress',
  'POST /send': 'Transactions.createTransaction',
};

module.exports = privateRoutes;
