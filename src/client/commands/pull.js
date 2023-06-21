const fs = require('fs')
const { EventEmitter } = require('events')

const Account = require('../../nostr/account')

module.exports = class Command extends EventEmitter {
  constructor (args) {
    super()

    this.args = args
  }

  async execute ({ nostr, ipfs, config, repoPath }) {
    try {
      if (typeof this.args[0] === 'undefined') {
        this.emit('log', 'Pulling initialized owned repositorys latest revision...')

        const repoConfig = JSON.parse(fs.readFileSync(repoPath + '/.fostr/repository.json', { encoding: 'utf-8' }))
        const privateKey = config.get('privateKey')
  
        if (typeof privateKey === 'undefined') return this.emit('error', 'Account not found, please import an account by fostr auth new/<private key>.')
  
        const account = new Account(privateKey)
  
        const revisions = await nostr.fetch({
          kinds: [ 96 ],
          authors: [ account.publicKey ],
          '#b': [ repoConfig.name ]
        })

        if (typeof revisions[0] === 'undefined') return this.emit('error', 'Cannot find any revisions for this repository.')

        if (revisions[0].content.startsWith('ipfs://')) {
          const cid = revisions[0].content.replace('ipfs://', '')

          for await (const file of ipfs.getFolder(cid)) {
            for await (const contents of ipfs.getFile(file.cid)) {
              fs.writeFileSync(file.name, contents)
            }
          }
          
        } else return this.emit('error', 'Unsupported repository commit type.')
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.emit('error', 'Repository is not initialized, use init to initialize!')
      } else if (err.message.includes('Unexpected token')) {
        this.emit('error', 'Repository is corrupted, please initialize again using init.')
      } else this.emit('error', err?.message ?? err)
    }
  }
}