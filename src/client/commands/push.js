const fs = require('fs')
const { EventEmitter } = require('events')

const Account = require('../../nostr/account')
const Event = require('../../nostr/event')

module.exports = class Command extends EventEmitter {
  constructor (args) {
    super()

    this.args = args
  }

  async execute ({ nostr, ipfs, config, repoPath }) {
    if (typeof this.args[0] === 'undefined') return this.emit('error', 'Please provide a title!')

    try {
      const repoIdentifier = JSON.parse(fs.readFileSync(repoPath + '/.fostr/repository.json', { encoding: 'utf-8' }))
      const privateKey = config.get('privateKey')

      if (typeof privateKey === 'undefined') return this.emit('error', 'Account not found, please import an account by fostr auth new/<private key>')

      const account = new Account(privateKey)

      const identifier = 'ipfs://' + (await ipfs.uploadPath(repoPath)).cid.toV0().toString()
      
      const event = new Event(96, account.publicKey, [[ 'b', repoIdentifier.name ], [ 't', this.args[0] ]], identifier)
      event.sign(account)

      await event.submit(nostr).catch(() => {
        return this.emit('error', 'Failed to submit event to majority of relayers!')
      })

      this.emit('log', 'Succesfully pushed repository to Nostr!')
    } catch (err) {
      console.log(err) 

      if (err.code === 'ENOENT') {
        this.emit('error', 'Repository is not initialized, use init to initialize!')
      } else if (err.message.includes('Unexpected token')) {
        this.emit('error', 'Repository is corrupted, please initialize again using init.')
      } else this.emit('error', err?.message ?? err)
    }
  }
}