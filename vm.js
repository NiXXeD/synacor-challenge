const _ = require('lodash')
const fs = require('fs')
const filename = process.argv[2] || 'bin/challenge.bin'
const vm = {
    memory: parseBin(filename),
    register: [0, 0, 0, 0, 0, 0, 0, 0],
    stack: []
}
const api = require('./ops')
api.memory = vm.memory
api.register = vm.register
api.stack = vm.stack

let i = 0
while (i < api.memory.length) {
    let op = api.memory[i]
    if (op < api.ops.length) {
        let opFunc = api[api.ops[op]]
        let args = _.range(opFunc.length)
            .map(() => api.memory[++i]).concat([i])
        i = opFunc(...args) || i
    } else {
        console.log(`Unknown op code "${op}" at instruction "${i}".`)
        break;
    }
    i++
}

function parseBin(file) {
    let stream = fs.readFileSync(file)
    return _.range(stream.length / 2)
        .map(offset => stream.readUInt16LE(offset * 2))
}
