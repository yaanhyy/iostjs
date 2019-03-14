const IOST = require('iost')
const bs58 = require('bs58');
const httpProvider = require('./HttpProvider')
node_local = "http://172.18.11.38:30001";
//node_public="http://35.182.211.144:30001"
node_public="http://api.iost.io"
// use RPC
const rpc = new IOST.RPC(new httpProvider(node_local,2000000));
//rpc.blockchain.getChainInfo().then(console.log);
// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 300000,
    delay:0,
    expiration: 90,
});
// init admin account
const account = new IOST.Account("admin");
const kp = new IOST.KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
//const kp = new IOST.KeyPair(bs58.decode('2bunM6G35ekhacXtR6xJvZqgup45LRGbQNyDP7YYTfbZN4xFetnnbLJ9HzX3uFaCiwxoHSdHs9Jxdc84nNKiA7EJ'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

// data = {"resultNumber":1000,"minVote":10,"options":[],"anyOption":true,"freezeTime":0}
//
// newVote =  async function(voter, memo,  data) {
//     const tx = iost.callABI("vote.iost", "newVote", [voter, memo,  data]);
//     account.signTx(tx);
//     const handler = new IOST.TxHandler(tx, rpc);
//     handler
//         .send()
//         .listen(1000, 10);
// }
//newVote("admin","vote",data)

vote =  async function(voter, candidate, numOfVote) {
    const tx = iost.callABI("vote_producer.iost", "vote", [voter, candidate, numOfVote]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));

        })
        .send()
        .listen(500, 120);
}
//vote("zhaoguo666","huobiwallet", "0.1")

getContractStorage  = async function(id,key,field) {
    const res = await rpc.blockchain.getContractStorage(id,key,field);
    console.log(res)
}
getContractStorage("vote_producer.iost","producerTable","huobiwallet")

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

logInProducer = async function(accountName) {
    const tx = iost.callABI("vote_producer.iost", "logInProducer", [accountName]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));

        })
        .send()
        .listen(1000, 10);
}
//logInProducer("admin")
getVoterBonus = async function(accountName) {
    const tx = iost.callABI("vote_producer.iost", "getVoterBonus", [accountName]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
        console.log("Success... tx, getVoterBonus: " + JSON.stringify(response));
        let accountInfo = new IOST.Account(accountName);

        //console.log("accountId:"+accountInfo.getID() )
    })
        .send()
        .listen(1000, 60);
}

getVoterBonus("lalala")

getCandidateBonus = async function(accountName) {
    const tx = iost.callABI("vote_producer.iost", "getCandidateBonus", [accountName]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, getCandidateBonus: " + JSON.stringify(response));
            let accountInfo = new IOST.Account(accountName);

            //console.log("accountId:"+accountInfo.getID() )
        })
        .send()
        .listen(1000, 60);
}

//getCandidateBonus("admin")

topupVoterBonus = async function(candidate, reward, accountName) {
    const tx = iost.callABI("vote_producer.iost", "topupVoterBonus", [candidate, reward, accountName]);
    tx.addApprove("iost","unlimited")
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));
            let accountInfo = new IOST.Account(accountName);

            //console.log("accountId:"+accountInfo.getID() )
        })
        .send()
        .listen(1000, 60);
}

//topupVoterBonus("admin", "5000", "admin")
getAccountInfo = async function(accountName, isReversible, feild) {
    const accountInfo = await rpc.blockchain.getAccountInfo(accountName, isReversible);
    console.log("accountInfo:"+JSON.stringify(accountInfo))
    console.log(feild+":"+JSON.stringify(accountInfo[feild]))
    // if(accountInfo[feild] != 0.1)
    // {
    //     console.log(feild+":"+accountInfo[feild])
    // }
}
//getAccountInfo("lalala", true, "vote_infos")

GetProducerVoteInfo = async function(candidate) {
    const url = "getProducerVoteInfo/"+candidate+"/true"
    const voteInfo = await rpc.getProvider().send('get', url);
    console.log("ProducerVoteInfo:"+JSON.stringify(voteInfo))
}

//GetProducerVoteInfo("lalala")
voterWithdraw = async function(accountName) {
    const tx = iost.callABI("vote_producer.iost", "voterWithdraw", [accountName]);
    account.signTx(tx);
    const handler = new IOST.TxHandler(tx, rpc);
    handler
        .onSuccess(function (response) {
            console.log("Success... tx, receipt: " + JSON.stringify(response));
            let accountInfo = new IOST.Account(accountName);

            //console.log("accountId:"+accountInfo.getID() )
        })
        .send()
        .listen(1000, 60);
}

//voterWithdraw("lalala")
