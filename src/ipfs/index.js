const ipfs = require('ipfs-http-client')

module.exports = class IPFS {
  constructor (gateway) {
    
    this.gateway = ipfs.create(gateway)
  }

  async uploadPath (path) {
    const fileQueue = this.gateway.addAll(ipfs.globSource(path, '**/*'), { wrapWithDirectory: true })
    let uploadedFiles = []

    for await (const file of fileQueue) {
      uploadedFiles.push(file)
    }

    return uploadedFiles.find(file => file.path === '')
  }

  getFolder (cid) {
    return this.gateway.ls(cid)
  }

  getFile (cid) {
    return this.gateway.cat(cid)
  }
}