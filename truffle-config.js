const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const NETWORK_ID = "1001";
const GASLIMIT = "50000000";
const URL = `https://api.baobab.klaytn.net:8651`;
const PRIVATE_KEY =
  "0x383ba9e9591cc01ecd5ed9bc0b1f9e17cbfded6b8a615ae40511cd13318875af";

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },

    klaytn: {
      provider: new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },
};
