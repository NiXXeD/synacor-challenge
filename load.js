var fs = require('fs')

module.exports = function() {
    var memory = parseBin('challenge.bin')
    var register = register || [0, 0, 0, 0, 0, 0, 0, 0]
    var stack = stack || []
    return {memory, register, stack}
}

function parseBin(file) {
    var stream = fs.readFileSync(file)
    return [...Array(stream.length / 2).keys()]
        .map(offset => stream.readUInt16LE(offset * 2))
 }
