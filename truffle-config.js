module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,       // Ganache CLI default RPC port
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
