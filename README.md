## Open Crypto API

Standardised API for creating wallet, retrieving, without much hassle

Next version is for security like keeping private keys safe.

## For Developmemt Settings

```
"prestart": "npm run drop-sqlite-db || true",

```


## For custom network settings

```
addNetwork({
  name: 'livenet',
  alias: 'mainnet',
  pubkeyhash: 0x3d,
  privatekey: 0x2e,
  scripthash: 0x05,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0x61a2f5cb,
  port: 28732,
  dnsSeeds: [
    '68.183.236.217',
    '159.65.189.155',
    '209.97.188.183',
    '104.248.169.67'
  ]
});

```
