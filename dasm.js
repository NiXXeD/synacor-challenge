let memory = require('./load')().memory
var ops = require('./ops')(null, null, memory)

var i = 0
while (i < memory.length) {
    let op = memory[i]
    if (op < ops.ops.length) {
        var o = ops.ops[op]
        var instruction = i
        var opFunc = ops[o]
        let args = [...Array(opFunc.length)].map(() => memory[++i])
        console.log(instruction, o.toUpperCase(), ...args)
    }
    i++
}
