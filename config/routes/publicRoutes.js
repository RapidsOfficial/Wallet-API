const publicRoutes = {
  'POST /user': 'UserController.register',
  'POST /register': 'UserController.register', // alias for POST /user
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'POST /wallet': 'WalletController.createWallet',
  'GET /address': 'AddressController.getAddress',
  'POST /send': 'Transactions.createTransaction',
  'GET /send/:id':'Transactions.getTransaction'
};

module.exports = publicRoutes;
