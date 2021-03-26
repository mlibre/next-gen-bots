var config = {
    apiUrl: "https://mywallet.bittubeapp.com/",
    mainnetExplorerUrl: "https://explorer.bit.tube/",
    testnetExplorerUrl: "",
    stagenetExplorerUrl: "",
    nettype: 0, /* 0 - MAINNET, 1 - TESTNET, 2 - STAGENET */
    coinUnitPlaces: 8,
    txMinConfirms: 10,         // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Bittube
    txCoinbaseMinConfirms: 10, // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Bittube
    coinSymbol: 'TUBE',
    openAliasPrefix: "tube",
    coinName: 'Tube',
    coinUriPrefix: 'tube:',
    addressPrefix: 0xd1,
    integratedAddressPrefix: 0x404f,
    subAddressPrefix: 0x3750,
    addressPrefixTestnet: 53,
    integratedAddressPrefixTestnet: 54,
    subAddressPrefixTestnet: 63,
    addressPrefixStagenet: 24,
    integratedAddressPrefixStagenet: 25,
    subAddressPrefixStagenet: 36,
    feePerKB: new BigInteger('2000000000'),//20^10 - not used anymore, as fee is dynamic.
    dustThreshold: new BigInteger('100000'),//10^10 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
    txChargeRatio: 0.5,
    defaultMixin: 3, // minimum mixin for hardfork v7 is 6 (ring size 7)
    txChargeAddress: '',
    idleTimeout: 5,
    idleWarningDuration: 15,
    maxBlockNumber: 1000000,
    avgBlockTime: 120,
    debugMode: false
};
