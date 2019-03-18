const nacl = require('tweetnacl');
const   oo7 = require('oo7-substrate');
const bs58 = require('ss58');
const { generateMnemonic, mnemonicToSeed } = require('bip39')

let cache = {}
function seedFromPhrase(phrase) {
    if (!cache[phrase]) {
        cache[phrase] = phrase.match(/^0x[0-9a-fA-F]{64}$/)
            ? hexToBytes(phrase)
            : new Uint8Array(mnemonicToSeed(phrase).slice(0, 32))
    }
    return cache[phrase]
}
//seed: 0x8fd60023a825d202d77d2189ed39011c09bb28bec7999bf37ac7d8159a98260b => 5F9gXwoNS6mTZop5VC2dyUNEzs7kGNZCD9V13wdcuS3EiDeD =>race column ritual best unveil green suggest okay evil dice leave nothing

let key = nacl.sign.keyPair.fromSeed(seedFromPhrase("race column ritual best unveil green suggest okay evil dice leave nothing"))
let pubkey = key.publicKey
//console.log(pubkey)
//public key
let key_data = oo7.secretStore().accountFromPhrase("0x8fd60023a825d202d77d2189ed39011c09bb28bec7999bf37ac7d8159a98260b")
console.log(oo7.ss58Encode(key_data));

//private
console.log(oo7.bytesToHex(key.secretKey))
//console.log(ss58.encode(key.secretKey))

 pubkey = oo7.ss58Encode(key.publicKey)
 console.log(pubkey)

let account = new oo7.AccountId(key.publicKey)
let address = oo7.ss58Encode(account)
console.log(address.toString())

//casual affair grocery half acoustic once raw man expose fortune display forward =>5GouQ8jtH6wZs6BmBoqX8nxUiMB3JR952Zj3v1MPV83EdhpC
