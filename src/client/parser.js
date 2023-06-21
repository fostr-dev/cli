module.exports = class Parser {
  static parseArgs (argv) {
    const appArgs = argv.slice(2)

    return {
      command: appArgs.shift(),
      args: appArgs
    }
  }
}