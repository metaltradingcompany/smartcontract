require('dotenv').config();
const PrivateKeyProvider = require("truffle-privatekey-provider");
const HDWalletProvider = require('truffle-hdwallet-provider');
const {infuraMainAddress, infuraRopstenAddress} = require('./configs/api.config');
const wallet = require('./configs/wallet.config');


module.exports = {
    networks: {
        development: {
            protocol: 'http',
            host: 'localhost',
            port: 8545,
            gas: 5000000,
            gasPrice: 5e9,
            networkId: '*',
        },
        private: {
            provider: () => new PrivateKeyProvider(wallet.secret, "http://localhost:8545"),
            gas: 6700000,
            gasPrice: 10e9,
            networkId: '*',
            from: wallet.from
        },
        ropsten: {
            provider: () => new PrivateKeyProvider(wallet.secret, "https://ropsten.infura.io/v3/df383655de5842e49f6dbfab806bf001"),
            networkId: 3,       // Ropsten's id
        },
        main: {
            provider: () => new PrivateKeyProvider(wallet.secret, infuraMainAddress),
            networkId: 1,
        },
        matic: {
            provider: () => new PrivateKeyProvider(wallet.secret, `https://rpc-mumbai.matic.today`),
            networkId: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        zeroether: {
            protocol: 'http',
            host: '0.0.0.0',
            port: 8545,
            networkId: '*',
        }
    },
};
