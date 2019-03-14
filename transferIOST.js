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
var account = new IOST.Account("hongjichuan");
//raw_pri= bs58.decode('5SnN8qdRqWSenR9j8AWxFVpfoEkeDrQfETRNnfLTJ2azCN1kofJTTaWTewk8Depq4Czujir6hPNSscrHcE7XNZHM')
//const kp = new IOST.KeyPair(bs58.decode('4TLm6bXLLLy37p1RzVefGH7eGmWApuArEaiuh5fwVHimT3Yobo9dKxrSAwNsuLzECMpPNJgjf5Y38rJ8h2atPwr6'));
var kp = new IOST.KeyPair(bs58.decode('5SnN8qdRqWSenR9j8AWxFVpfoEkeDrQfETRNnfLTJ2azCN1kofJTTaWTewk8Depq4Czujir6hPNSscrHcE7XNZHM'));
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

function sleep(time){
    for( var temp = Date.now(); Date.now() - temp <= time;);
}

var rf=require("fs");
var jsonStr=rf.readFileSync("iost.json","utf-8");
var accounts = JSON.parse(jsonStr);


// for(var i=1000;i<1100;i++) {
//     account = new IOST.Account(10000+i+"");
//     kp = new IOST.KeyPair(bs58.decode(accounts[i].privateKey))
//
//     account.addKeyPair(kp, "owner");
//     account.addKeyPair(kp, "active");
//     transfer(10000+i+"","admin", "0.1","")
//     sleep(200)
// }

// for(var i=1100;i<1101;i++) {
//
//     transfer("admin",10000+i+"", "0.1","")
//     sleep(200)
// }
//transfer("admin","lalala", "10000000","世界和平")
//transfer("hongjichuan","lalala", "0.00000001","")
getTxReceiptByTxHash =   async function(txId) {

    const receiptInfo = await rpc.transaction.getTxReceiptByTxHash(txId);
    console.log("receiptInfo:" + JSON.stringify(receiptInfo));
}
getTxReceiptByTxHash("Hm6iPLH1i1NcYyhzhz9YVecyq5WHQxgxQUNXmDHRH857")

getTxByHash =   async function(txId) {

    const txInfo = await rpc.transaction.getTxByHash(txId);
    console.log("txInfo:" + JSON.stringify(txInfo));
}
//getTxByHash("74MGEosiPyUjjNkPxMSzTDain44GTKBCmKn8JebW8yTC")

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

//rpc.blockchain.getChainInfo().then(console.log);
//totalSupply("iost")
