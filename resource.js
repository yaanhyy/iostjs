const IOST = require('iost')
const bs58 = require('bs58');
node = "http://172.18.11.38:30001";
// use RPC
const rpc = new IOST.RPC(new IOST.HTTPProvider(node));
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

buy_ram = async function(buyer, receiver, amount) {
    const tx = iost.callABI("ram.iost", "buy", [buyer, receiver, amount]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//buy_ram("admin", "admin", 10000)

pledge = async function(buyer, receiver, amount) {
    const tx = iost.callABI("gas.iost", "pledge", [buyer, receiver, amount+""]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//pledge("admin", "admin", 10000)
