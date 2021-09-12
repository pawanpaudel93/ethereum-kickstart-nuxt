const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config()

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: "*" // Any network (default: none)
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(
                    process.env.WALLET_SECRET,
                    process.env.INFURA_API
                );
            },
            network_id: 4
        }
    },
    compilers: {
        solc: {
            version: "0.7.0"
        }
    }
};
