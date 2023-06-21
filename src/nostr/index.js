require('websocket-polyfill')
const { SimplePool } = require('nostr-tools')

module.exports = class Nostr {
  constructor (relays) {
    if (!Array.isArray(relays)) throw Error('Relays should be an array.')

    this.pool = new SimplePool()
    this.relays = relays

    this.pool.get(this.relays)
  }

  
  async fetch (filter) {
    return await this.pool.list(this.relays, [ filter ])
  } 

  submit (event) {
    return new Promise((resolve, reject) => {
      const pub = this.pool.publish(this.relays, event)
      
      let acceptedRelays = 0
      let deniedRelays = 0

      pub.on('ok', () => {
        acceptedRelays += 1

        if (acceptedRelays > this.relays.length / 2) {
          resolve()
        }
      })

      pub.on('failed', (relay) => {
        deniedRelays += 1
        
        if (deniedRelays > this.relays.length / 2) {
          reject()
        }
      })
    })
  }
}