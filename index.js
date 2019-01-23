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
const accountList = new Array(3);
//admin private key to public key
const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

let kp_new = IOST.KeyPair.newKeyPair(IOST.Algorithm.Secp256k1);
prikey_bs58 = bs58.encode(kp_new.seckey);
console.log(prikey_bs58)
kp_com =  new IOST.KeyPair(bs58.decode(prikey_bs58), IOST.Algorithm.Secp256k1)

/**
 * create account
 */
const tx = iost.newAccount(
    "yyloveuu",
    "admin",
    kp.id,
    kp.id,
    1024,
    1000
);
account.signTx(tx);

const handler = new IOST.TxHandler(tx, rpc);
handler
    .onSuccess(function (response) {
        console.log("Success... tx, receipt: "+ JSON.stringify(response));
        accountList[0] = new IOST.Account(myid);
        accountList[0].addKeyPair(kp, "owner");
        accountList[0].addKeyPair(kp, "active");
    })
    .send()
    .listen(1000, 5);
