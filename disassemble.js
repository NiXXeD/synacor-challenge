let memory = require('./load')().memory
let ops = require('./ops')(null, null, memory)

var i = 0
while (i < memory.length) {
    let op = memory[i]
    if (op < ops.ops.length) {
        let o = ops.ops[op]
        let instruction = i
        let opFunc = ops[o]
        let args = [...Array(opFunc.length)].map(() => memory[++i])
        console.log(`${instruction} ${o.toUpperCase()} ${args.join(' ')}`)
    }
    i++
}
