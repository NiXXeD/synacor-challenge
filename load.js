const fs = require('fs')

module.exports = function() {
    let filename = process.argv[2] || 'challenge.bin'
    let memory = parseBin(filename)
    let register = [0, 0, 0, 0, 0, 0, 0, 0]
    let stack = []
    return {memory, register, stack}
}

function parseBin(file) {
    let stream = fs.readFileSync(file)
    return [...Array(stream.length / 2).keys()]
        .map(offset => stream.readUInt16LE(offset * 2))
 }
