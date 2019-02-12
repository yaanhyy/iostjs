const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
node = "http://172.18.11.38:30001";
// use RPC
const rpc = new IOST.RPC(new httpProvider(node));
rpc.blockchain.getChainInfo().then(console.log);
// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 2000000,
    delay:0,
    expiration: 90,
});
// init admin account
const account = new IOST.Account("admin");
const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");


transfer = async function(fromAccount, toAccount, amount, memo) {
// send a call
    const tx = iost.callABI("token.iost", "transfer", ["iost", fromAccount, toAccount, amount, memo]);
    account.signTx(tx);

// send tx and handler result
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 90);

}
transfer("admin","lalala", "10000","love")
