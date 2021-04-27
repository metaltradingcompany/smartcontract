module.exports = {
    secret: process.env.WALLET_SECRET || 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
    mnemonic: process.env.WALLET_MNEMONIC,
    from: process.env.WALLET_ADDRESS
};