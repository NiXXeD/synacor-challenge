const _ = require('lodash')
const fs = require('fs')
const filename = process.argv[2] || 'bin/challenge.bin'
function load() {
    let stream = fs.readFileSync(filename)
    return _.range(stream.length / 2)
        .map(offset => stream.readUInt16LE(offset * 2))
}
module.exports = load()
