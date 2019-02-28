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
const account = new IOST.Account("lalala");
const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");


tokenSym = "yytoken"

toAccount = "hongchuan"
create_token = async function(tokenSym, owner, decimal) {

// create token
    const tx = iost.callABI("token.iost", "create", [tokenSym, owner, 21000000, {
        "fullName": tokenSym,
        "decimal": decimal
    }]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);


}
//create_token(tokenSym, "lalala", 9)

issue_token = async function(tokenSym, toAccount) {
// issue token
    const tx = iost.callABI("token.iost", "issue", [tokenSym, toAccount, "99999"]);
    account.signTx(tx);

    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(async function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));
            let nbAdmin = await rpc.blockchain.getBalance("admin", tokenSym);
            let nb0 = await rpc.blockchain.getBalance(toAccount, tokenSym);
            console.log(nbAdmin.balance)
            console.log(nb0.balance)
        })
        .send()
        .listen(1000, 8);
}

//issue_token(tokenSym, "lalala")

transfer = async function(tokenSym, from, to, amount, memo){
    const tx = iost.callABI("token.iost", "transfer", [tokenSym, from, to, amount, memo]);
    account.signTx(tx);

    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(async function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));
            let nbAdmin = await rpc.blockchain.getBalance(from, tokenSym);
            let nb0 = await rpc.blockchain.getBalance(to, tokenSym);
            console.log(nbAdmin.balance)
            console.log(nb0.balance)
        })
        .send()
        .listen(1000, 8);
}
transfer(tokenSym, "admin", "latalala", 10, "ok")

get_balance = async function(tokenSym, account) {

    let resBalance = await rpc.blockchain.getBalance(account, tokenSym);
    console.log("account:"+account+"balance:"+resBalance.balance)
}
//get_balance("uutoken", "admin")
