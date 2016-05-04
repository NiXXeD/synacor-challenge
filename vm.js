const _ = require('lodash')
const vm = {
    memory: require('./load'),
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
