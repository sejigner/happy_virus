const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const NETWORK_ID = "1001";
const GASLIMIT = "20000000";
const URL = `https://api.baobab.klaytn.net:8651`;
const PRIVATE_KEY =
  "0x95f6f59e8b098f7ff90f773f20bdf83bf73c9d06d4db3d91500747e139e2bded";

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },

    // klaytn: {
    //   provider: new HDWalletProvider(PRIVATE_KEY, URL),
    //   network_id: NETWORK_ID,
    //   gas: GASLIMIT,
    //   gasPrice: null,
    // },
  },
};
