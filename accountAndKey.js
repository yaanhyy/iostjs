const IOST = require('iost')
const bs58 = require('bs58');
node = "http://172.18.11.38:30001";
// use RPC
const rpc = new IOST.RPC(new IOST.HTTPProvider(node));
rpc.blockchain.getChainInfo().then(console.log);

// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 1000000,
    delay:0,
    expiration: 90,
    defaultLimit: "1000"
});
const account = new IOST.Account("admin");
//admin private key to public key
const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

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
//newAccount("admin", "lalala", kp.id, kp.id, 1000,  1000)


getAccountInfo = async function(accountName, isReversible, feild) {
    const accountInfo = await rpc.blockchain.getAccountInfo(accountName, isReversible);
    console.log("accountInfo:"+JSON.stringify(accountInfo))
    console.log(feild+":"+accountInfo[feild])
}
getAccountInfo("hongchuan", true, "vote_infos")
getAccountInfo("admin", true, "balance")
getAccountInfo("lalala", true, "balance")

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

applyRegister = async function(accountName,  pubkeyBase58, Location, websiteUrl, networkId, isProducer) {
    const tx = iost.callABI("vote_producer.iost", "applyRegister", [accountName,  pubkeyBase58, Location, websiteUrl, networkId, isProducer]);
    var account = new IOST.Account(accountName);
    account.addKeyPair(kp, "owner");
    account.addKeyPair(kp, "active");
    tx.addSigner(account.getID(), "vote");
   // account.sign(tx, "vote");
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}

//applyRegister("lalala", kp.id, "", "network.io" , "", true)


