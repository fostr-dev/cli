const { EventEmitter } = require('events')

const Account = require('../../nostr/account')

module.exports = class Command extends EventEmitter {
  constructor (args) {
    super()

    this.args = args
  }

  async execute ({ config }) {
    if (typeof this.args[0] === 'undefined') {
      const privateKey = config.get('privateKey')

      if (typeof privateKey === 'undefined') {
        this.emit('error', 'Account not found, please import an account by fostr auth new/<private key>')
      } else {
        const account = new Account(privateKey)

        this.emit('info', `Currently logged as ${account.account}`)
      }
    } else if (this.args[0] === 'new') {
      const newAccount = Account.createOne()

      config.put('privateKey', newAccount.privateKey)

      this.emit('log', 'Created a new account and imported it successfuly!')
      this.emit('info', `Private key is ${newAccount.privateKey}`)
    } else {
      // TODO: Support nsec

      const account = new Account(this.args[0])

      config.put('privateKey', account.privateKey)

      this.emit('log', 'Imported it successfuly!')
    }
  }
}