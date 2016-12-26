const _ = require('lodash')
const memory = require('./load')
const ops = require('./ops')

let i = 0
while (i < memory.length) {
    let op = memory[i]
    if (op < ops.ops.length) {
        let o = ops.ops[op]
        let instruction = i
        let opFunc = ops[o]
        let args = _.range(opFunc.length).map(() => memory[++i])

        if (op === 19) args.push(String.fromCharCode(args[0]).replace(/\n/g, '\\n'))

        console.log(`${instruction} ${o.toUpperCase()} ${args.join(' ')}`)
    }
    i++
}
