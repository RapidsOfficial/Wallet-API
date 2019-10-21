const jwt = require('jsonwebtoken');
const Message = require('rapids-message');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const issue = (payload) => jwt.sign(payload, secret, { expiresIn: 10800 });
  const verify = (token, cb) => jwt.verify(token, secret, {}, cb);

  const verifySignature = (address, signature) => new Message('We are using bitcoin based AUTH services using address and signature').verify(address, signature);

  return {
    issue,
    verify,
    verifySignature,
  };
};

module.exports = authService;
