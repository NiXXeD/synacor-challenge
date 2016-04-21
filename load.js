var fs = require('fs')

module.exports = function(bin) {
    var memory = parseBin(bin)
    var register = register || [0, 0, 0, 0, 0, 0, 0, 0]
    var stack = stack || []
    return {memory, register, stack}
}

function parseBin(file) {
    return fs.readFileSync(file, 'binary').trim()
        .split('').map(i => i.charCodeAt(0)).reduce((r, v, i) => {
        if (i % 2) {
            var pad = "00"
            var byte1 = v.toString(16)
            byte1 = pad.substr(0, 2 - byte1.length) + byte1
            var byte2 = r.past.toString(16)
            byte2 = pad.substr(0, 2 - byte2.length) + byte2

            var byte = parseInt(byte1 + byte2, 16)
            r.ops.push(byte)
        } else {
            r.past = v
        }
        return r
    }, {ops: []}).ops
}
