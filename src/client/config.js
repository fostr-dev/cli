const fs = require('fs')
const path = require('path')

module.exports = class Config {
  constructor (filePath) {
    this.path = filePath

    this.reload()
  }

  reload () {
    try {
      this.contents = JSON.parse(fs.readFileSync(this.path, { encoding: 'utf-8' }))
    } catch (err) {
      this.contents = {}
    }
  }

  write () {
    const dirName = path.dirname(this.path)
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true })
    }
  
    fs.writeFileSync(this.path, JSON.stringify(this.contents), { encoding: 'utf-8' })
  }

  put (key, value) {
    this.contents[key] = value

    this.write()
  }

  get (key) {
    return this.contents[key]
  }
}
