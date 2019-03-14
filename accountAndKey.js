const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
Algorithm = require('iost/lib/crypto/algorithm');
//node_public = "http://35.182.211.144:30001";
node_public="http://api.iost.io"
node_local = "http://172.18.11.38:30001";
// use RPC
const rpc = new IOST.RPC(new httpProvider(node_local));
rpc.blockchain.getChainInfo().then(console.log);

// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 2000000,
    delay:0,
    expiration: 90,
    defaultLimit: "1000"
});
const account = new IOST.Account("hongjichuan");
//admin private key to public key
const kp = new IOST.KeyPair(bs58.decode('5SnN8qdRqWSenR9j8AWxFVpfoEkeDrQfETRNnfLTJ2azCN1kofJTTaWTewk8Depq4Czujir6hPNSscrHcE7XNZHM'));
//const kp = new IOST.KeyPair(bs58.decode('4TLm6bXLLLy37p1RzVefGH7eGmWApuArEaiuh5fwVHimT3Yobo9dKxrSAwNsuLzECMpPNJgjf5Y38rJ8h2atPwr6'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

//var kp_account = new IOST.KeyPair(bs58.decode('4TLm6bXLLLy37p1RzVefGH7eGmWApuArEaiuh5fwVHimT3Yobo9dKxrSAwNsuLzECMpPNJgjf5Y38rJ8h2atPwr6'))
//generate key
let kp_new = IOST.KeyPair.newKeyPair(Algorithm.Secp256k1);
prikey_bs58 = bs58.encode(kp_new.seckey);
console.log(prikey_bs58)
kp_com =  new IOST.KeyPair(bs58.decode(prikey_bs58), Algorithm.Secp256k1)

/**
 * create account
 */
newAccount = async function(creater, accountName, ownerkeyId, activekeyId, initialRAM, initialGasPledge) {
    const tx = iost.newAccount(
        accountName,
        creater,
        ownerkeyId,
        activekeyId,
        initialRAM,
        initialGasPledge
    );
    account.signTx(tx);

    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));
            let accountInfo = new IOST.Account(accountName);

            //console.log("accountId:"+accountInfo.getID() )
        })
        .onFailed(function (response) {
            console.log("Failed... tx, receipt: "+ JSON.stringify(response));

        })
        .send()
        .listen(1000, 5);
}
//newAccount("admin", "lalala", kp_account.id, kp_account.id, 10,  10)
function sleep(time){
    for( var temp = Date.now(); Date.now() - temp <= time;);
}


var rf=require("fs");
var jsonStr=rf.readFileSync("iost.json","utf-8");
var accounts = JSON.parse(jsonStr);
 // for(var i=1100;i<1110;i++) {
 //
 //     kp_account = new IOST.KeyPair(bs58.decode(accounts[i].privateKey))
 //     newAccount("admin", 10000+i+"", kp_account.id, kp_account.id, 10, 10) //lalala:oWCk1t3foCLqoBFDzSDmpuk5q2wCjQT2G98gZZhzVNtdvEc2JMQv4yetPwSmfJoxnfUhKhYDD1X3gm2XaujpFUR
 //     sleep(500)
 // }
getAccountInfo = async function(accountName, isReversible, feild) {
    const accountInfo = await rpc.blockchain.getAccountInfo(accountName, isReversible);
    console.log("accountInfo:"+JSON.stringify(accountInfo))
    console.log(feild+":"+JSON.stringify(accountInfo[feild]))
    // if(accountInfo[feild] != 0.1)
    // {
    //     console.log(feild+":"+accountInfo[feild])
    // }
}
 getAccountInfo("hongjichuan", true, "vote_infos")
// getAccountInfo("hongjichuan", true, "balance")
// for(var i=2000;i<2100;i++) {
//     getAccountInfo(10000+i+"", true, "balance")
// }

addPermission =  async function(account, permissionName, threshold) {
    const tx = iost.callABI("auth.iost", "addPermission", [account, permissionName, threshold]);
    account = new IOST.Account(account);
    account.addKeyPair(kp, "owner");
    account.addKeyPair(kp, "active");
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}

//addPermission("lalala", "vote", 1)

assignPermission = async function(account, permissionName, pubkey, weight) {
    const tx = iost.callABI("auth.iost", "assignPermission", [account, permissionName, pubkey, weight]);
    account = new IOST.Account(account);
    account.addKeyPair(kp, "owner");
    account.addKeyPair(kp, "active");
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//assignPermission("lalala", "owner",  "Gcv8c2tH8qZrUYnKdEEdTtASsxivic2834MQW6mgxqto",100)


getChainInfo = async function() {
    const chainInfo = await rpc.blockchain.getChainInfo();
    console.log("chainInfo:"+JSON.stringify(chainInfo))
}
getChainInfo()




GetProducerVoteInfo = async function(candidate) {
    const url = "getProducerVoteInfo/"+candidate+"/true"
    const voteInfo = await rpc.getProvider().send('get', url);
    console.log("ProducerVoteInfo:"+JSON.stringify(voteInfo))
}

//GetProducerVoteInfo("metanyx")

revokePermission = async function(account, permissionName, pubkey) {
    const tx = iost.callABI("auth.iost", "revokePermission", [account, permissionName, pubkey]);
    account = new IOST.Account(account);
    account.addKeyPair(kp, "owner");
    account.addKeyPair(kp, "active");
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//revokePermission("lalala", "owner",  "GxD1rvcFy7jg6LSJyJGFAfjpYydApBwNrUgu2nq94dsU")
