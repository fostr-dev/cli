#!/usr/bin/env node
const Nostr = require('./src/nostr')
const IPFS = require('./src/ipfs')
const Config = require('./src/client/config')
const Parser = require('./src/client/parser')

const modernlog = require('modernlog')

const nostr = new Nostr(["wss://brb.io","wss://relay.damus.io","wss://nostr.adpo.co","wss://nos.lol","wss://relay.nostr.band","wss://offchain.pub"])
const ipfs = new IPFS('https://node-ipfs.thomiz.dev/5001/api/v0')
const config = new Config(`${require("os").homedir}/.fostr/config.json`)
const execution = Parser.parseArgs(process.argv)

try {
  const command = new (require(`./src/client/commands/${execution.command}`))(execution.args)

  command.on('log', (log) => { modernlog.log(log) })
  command.on('info', (err) => { modernlog.info(err) })
  command.on('error', (err) => { modernlog.error(err); process.exit() })

  command.execute({ nostr, ipfs, config, repoPath: process.cwd() }).then(() => {
    process.exit()
  })
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    modernlog.error(`Command not found?!`)
  } else throw err

  process.exit()
}