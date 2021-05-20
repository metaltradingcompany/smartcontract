module.exports = {
    secret: process.env.WALLET_SECRET || 'eb3ac76c0a38b54d14042ebc75386b801037b1e0eb87cbe6eceffbf7062c797e',
    mnemonic: process.env.WALLET_MNEMONIC,
    from: process.env.WALLET_ADDRESS
};
