const _ = require('lodash')
const fs = require('fs')
const filename = process.argv[2] || 'challenge.bin'
const vm = {
    memory: parseBin(filename),
    register: [0, 0, 0, 0, 0, 0, 0, 0],
    stack: []
}
const api = require('./ops')(vm)

let i = 0
while (i < api.memory.length) {
    let op = api.memory[i]
    if (op < api.ops.length) {
        let opFunc = api[api.ops[op]]
        let args = _.range(opFunc.length)
            .map(() => api.memory[++i]).concat([i])
        i = opFunc(...args) || i
    } else {
        console.log('Unknown operation', op)
        break;
    }
    i++
}

function parseBin(file) {
    let stream = fs.readFileSync(file)
    return _.range(stream.length / 2)
        .map(offset => stream.readUInt16LE(offset * 2))
}
