const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
//node_public = "http://35.182.211.144:30001";
node_public="http://api.iost.io"
node_local = "http://172.18.11.38:30001";
// use RPC
const rpc = new IOST.RPC(new httpProvider(node_local));
rpc.blockchain.getChainInfo().then(console.log);

// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 1000000,
    delay:0,
    expiration: 90,
    defaultLimit: "1000"
});
const account = new IOST.Account("hongjichuan");
//admin private key to public key
const kp = new IOST.KeyPair(bs58.decode('5SnN8qdRqWSenR9j8AWxFVpfoEkeDrQfETRNnfLTJ2azCN1kofJTTaWTewk8Depq4Czujir6hPNSscrHcE7XNZHM'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

const  kp_account = new IOST.KeyPair(bs58.decode('352M2EhJXNuZ19YfEiVV5ymQcYQUNLRRK8dM9T1LkGDiSPZtzYugQrjWxRY8k1VPMY6kyyA6xixCBjY7rbYfaQRP'))
//generate key
let kp_new = IOST.KeyPair.newKeyPair();
prikey_bs58 = bs58.encode(kp_new.seckey);
console.log(prikey_bs58)
kp_com =  new IOST.KeyPair(bs58.decode(prikey_bs58))

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

            console.log("accountId:"+accountInfo.getID() )
        })
        .send()
        .listen(1000, 5);
}
newAccount("hongjichuan", "wallethuobi", kp_account.id, kp_account.id, 10,  10)


getAccountInfo = async function(accountName, isReversible, feild) {
    const accountInfo = await rpc.blockchain.getAccountInfo(accountName, isReversible);
    console.log("accountInfo:"+JSON.stringify(accountInfo))
    console.log(feild+":"+accountInfo[feild])
}
getAccountInfo("hongjichuan", true, "vote_infos")
getAccountInfo("hongjichuan", true, "balance")
getAccountInfo("tatat", true, "balance")

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
//assignPermission("lalala", "vote",  "Gcv8c2tH8qZrUYnKdEEdTtASsxivic2834MQW6mgxqto",1)


getCahinInfo = async function() {
    const chainInfo = await rpc.blockchain.getChainInfo();
    console.log("chainInfo:"+JSON.stringify(chainInfo))
}
getCahinInfo()
