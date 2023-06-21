const { generatePrivateKey, getPublicKey, signEvent, nip19 } = require('nostr-tools')

module.exports = class Account {
  constructor (privateKey) {
    this.publicKey = getPublicKey(privateKey)
    this.account = nip19.npubEncode(this.publicKey)
    this.privateKey = privateKey
  }

  static createOne () {
    return new this(generatePrivateKey())
  }

  sign (event) {
    return signEvent(event.toJSON(), this.privateKey)
  }

  toJSON () {
    return {
      publicKey: this.publicKey,
      privateKey: this.privateKey
    }
  }
}