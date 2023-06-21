const Event = require('../event')

module.exports = class NIP96 {
  constructor (nostr, account) {
    this.nostr = nostr
    this.account = account
  }

  async pushRevision (repository, identifier, title) {
    const event = new Event(96, this.account.publicKey, [[ 'b', repository ], [ 't', title ]], identifier)

    event.sign(this.account)

    await event.submit(this.nostr)
  }

  async getRevisions (pubKey, repository) {
    return await this.nostr.fetch({
      kinds: [ 96 ],
      authors: [ pubKey ],
      '#b': [ repository ]
    })
  }
}