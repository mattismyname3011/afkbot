const nearley = require('nearley')
const grammar = require('./grammar')

module.exports = {
  parse: (text) => {
    try {
      const parserNE = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
      parserNE.feed(text)
      return parserNE.results[0]
    } catch (e) {
      e.message = `Error parsing text '${text}'`
      throw e
    }
  }
}
