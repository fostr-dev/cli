const { EventEmitter } = require('events')

module.exports = class Command extends EventEmitter {
  constructor () {
    super()
  }

  async execute () {
    this.emit('info', `Fostr over IPFS CLI-client, commands:`)
    this.emit('info', `help, auth <new[private key]>, init <repo name>, push <description>, pull <repo identifier>`)
  }
}