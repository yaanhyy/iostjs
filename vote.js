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

data = {"resultNumber":1000,"minVote":10,"options":[],"anyOption":true,"freezeTime":0}

newVote =  async function(voter, memo,  data) {
    const tx = iost.callABI("vote.iost", "newVote", [voter, memo,  data]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//newVote("admin","vote",data)

vote =  async function(voteId, voter, options, amount) {
    const tx = iost.callABI("vote.iost", "vote", [voteId, voter, options, amount]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .send()
        .listen(1000, 10);
}
//vote("3","admin","admin", "100")
getContractStorage  = async function(id,key,field) {
    const res = await rpc.blockchain.getContractStorage(id,key,field);
    console.log(res)
}



getContractStorage("vote_producer.iost","producerTable","producer00001")
