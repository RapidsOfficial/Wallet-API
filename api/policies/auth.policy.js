const authService = require('../services/auth.service');

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
      );
      res.setHeader(
            'Access-Control-Allow-Headers',
            'x-signature,x-wallet-id,Content-Type,Authorization'
          );

  if (req.header('Authorization') && req.header('Content-Type') && req.header('x-signature') && req.header('x-wallet-id')) {
    // We need the address from the walletId
    try {
      address = req.header('Authorization')
      signature = req.header('x-signature')
      if (authService().verifySignature(address, signature))
        return next()
    }catch(error){
        console.log(error)
        return res.status(401).json({msg: error})
    }
  } else {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }


};
