const Message = require('rapids-message');
const authService = require('../../api/services/auth.service');

const bitcore = require('rapids-lib');

let message;
let signature;
let address;
const badAddress = 'RbnYw5oeXHrf9cPzNT9gm22fMUKNJC68hL';

beforeEach(async () => {
  const privateKey = new bitcore.PrivateKey();
  // We need pubKey
  const pubKey = privateKey.toPublicKey();
  address = pubKey.toAddress(bitcore.Networks.livenet);
  message = new Message('We are using bitcoin based AUTH services using address and signature');
  signature = message.sign(privateKey);
});


test('Sign and verify is working as expected', async () => {
  console.log('Sign and verify is working as expected');
  expect(authService().verifySignature(address.toString(), signature)).toBeTruthy();
});

test('Sign and verify is not working as expected because of bad address', async () => {
  console.log('Sign and verify is not working as expected because of bad address');
  expect(authService().verifySignature(badAddress, signature)).toBeFalsy();
});
