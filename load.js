const _ = require('lodash')
const fs = require('fs')
const filename = process.argv[2] || 'bin/challenge.bin'
function load() {
    let buffer = fs.readFileSync(filename)
    return _.range(buffer.length / 2)
        .map(offset => buffer.readUInt16LE(offset * 2))
}
module.exports = load()
