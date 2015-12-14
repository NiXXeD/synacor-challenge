module.exports = {
    start: function() {
        let load = require('./load')()
        let register = load.register
        let stack = load.stack
        let memory = load.memory
        var ops = require('./ops')(register, stack, memory)

        var i = 0
        while (i < memory.length) {
            let op = memory[i]
            if (op < ops.ops.length) {
                var opFunc = ops[ops.ops[op]]
                let args = [...Array(opFunc.length)].map(() => memory[++i]).concat([i])
                //if (ops.ops[op] !== 'out') console.log(ops.ops[op].toUpperCase(), ...args)
                i = opFunc(...args) || i
            } else {
                console.log('Unknown operation', op)
                break;
            }
            i++
        }
    }
}
