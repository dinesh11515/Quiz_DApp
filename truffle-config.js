const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = 'valve leaf unhappy inner behave fiber lecture air choice turtle island clean';
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/733090e883aa457fb9f1d09cb80796d3`),
      network_id: 4,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  }
};
