const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

module.exports = class Command extends EventEmitter {
  constructor (args) {
    super()

    this.args = args
  }

  async execute ({ repoPath }) {
    const repositoryFile = repoPath + '/.fostr/repository.json'

    const dirName = path.dirname(repositoryFile)
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true })
    }
  
    fs.writeFileSync(repositoryFile, JSON.stringify({
      name: this.args[0]
    }), { encoding: 'utf-8' })

    this.emit('info', `Initialized a new repository locally! You can release repository by push command.`)
  }
}