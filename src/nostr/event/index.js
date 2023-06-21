const { getEventHash } = require('nostr-tools')

module.exports = class Event {
  constructor (kind, author, tags, content) {
    this.kind = kind
    this.author = author
    this.createdAt = Math.floor(Date.now() / 1000),
    this.tags = tags
    this.content = content
  }

  sign (account) {
    this.id = getEventHash(this.toJSON())
    this.signature = account.sign(this)
  }

  async submit (nostr) {
    await nostr.submit(this.toJSON())
  }

  toJSON () {
    const serializedEvent = {
      kind: this.kind,
      pubkey: this.author,
      created_at: this.createdAt,
      tags: this.tags,
      content: this.content
    }

    if (typeof this.id !== 'undefined') serializedEvent['id'] = this.id
    if (typeof this.signature !== 'undefined') serializedEvent['sig'] = this.signature

    return serializedEvent
  }
}