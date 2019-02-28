const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
node_public = "http://35.182.211.144:30001";
node_local = "http://172.18.11.38:30001";
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
//const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");


transfer = async function(fromAccount, toAccount, amount, memo) {
// send a call
    const tx = iost.callABI("token.iost", "transfer", ["iost", fromAccount, toAccount, amount, memo]);
    account.signTx(tx);

// send tx and handler result
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));

        })
        .onFailed(function (response) {
            console.log("Failed... tx, receipt: "+ JSON.stringify(response));

        })
        .send()
        .listen(1000, 90);

}
 transfer("hongjichuan","huobiwallet", "0.00000001","")
//transfer("admin","lalala", "0.00000001","")
getTxReceiptByTxHash =   async function(txId) {

    const receiptInfo = await rpc.transaction.getTxReceiptByTxHash(txId);
    console.log("receiptInfo:" + JSON.stringify(receiptInfo));
}
//getTxReceiptByTxHash("7dGbSTARNKD8JvbfQyArHYbiDEMWN9JWBwgD7CYaJP7c")

getTxByHash =   async function(txId) {

    const txInfo = await rpc.transaction.getTxByHash(txId);
    console.log("txInfo:" + JSON.stringify(txInfo));
}
//getTxByHash("F3vs6cQkCPfA4ffGBQrmt4wkmky8MU1cfrDcpnqmDJhP")

totalSupply = async function(tokenSym) {

    const tx = iost.callABI("token.iost", "totalSupply", [tokenSym]);
    account.signTx(tx);

// send tx and handler result
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));

        })
        .send()
        .listen(1000, 90);

}

//totalSupply("iost")
