const publicRoutes = {
  'POST /user': 'UserController.register',
  'POST /register': 'UserController.register', // alias for POST /user
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /send/:id': 'Transactions.getTransaction',
  'POST /backup': 'WalletController.createBackup',
  'POST /wallet': 'WalletController.createWallet',
  'GET /address': 'AddressController.getAddress',
  'POST /send': 'Transactions.createTransaction',
  'GET /backup/status': 'WalletController.getBackupStatus',
  'GET /transactions/:transactionsID': 'Transactions.recieveTransactionsUpdate',
  'POST /address/new' : 'AddressController.generateAddress'
};

module.exports = publicRoutes;
