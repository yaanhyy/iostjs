const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
node = "http://172.18.11.38:30001";
node_public="http://api.iost.io"
// use RPC
const rpc = new IOST.RPC(new httpProvider(node_public));
//rpc.blockchain.getChainInfo().then(console.log);
// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 2000000,
    delay:0,
    expiration: 90,
});
// init admin account
const account = new IOST.Account("hongjichuan");
const kp = new IOST.KeyPair(bs58.decode('5SnN8qdRqWSenR9j8AWxFVpfoEkeDrQfETRNnfLTJ2azCN1kofJTTaWTewk8Depq4Czujir6hPNSscrHcE7XNZHM'));
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
//buy_ram("admin", "lalala", 10000000)

pledge = async function(buyer, receiver, amount) {
    const tx = iost.callABI("gas.iost", "pledge", [buyer, receiver, amount+""]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 50);
}
pledge("hongjichuan", "zhaoguo666", 30)
getgasratio  = async function() {
    const ratio = await rpc.blockchain.getGasRatio();
    console.log("low:"+ratio["lowest_gas_ratio"]+"\nmedian:"+ratio["median_gas_ratio"])
}
//getgasratio()
