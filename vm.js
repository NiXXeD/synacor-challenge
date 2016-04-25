module.exports = {
    start: function() {
        let load = require('./load')()
        let register = load.register
        let stack = load.stack
        let memory = load.memory
        var ops = require('./ops')(register, stack, memory)

        //skip first part of the check
        memory[5451] = 21
        memory[5452] = 21
        memory[5453] = 21

        //set expected value to 6 for check at 5491
        memory[5485] = 6

        //set register 8 to 25734 using some existing NOOPs
        memory[5487] = 32775
        memory[5488] = 25734

        //skip second part of the check
        memory[5489] = 21
        memory[5490] = 21

        var i = 0
        while (i < memory.length) {
            let op = memory[i]
            if (op < ops.ops.length) {
                var opFunc = ops[ops.ops[op]]
                let args = [...Array(opFunc.length)].map(() => memory[++i]).concat([i])
                i = opFunc(...args) || i
            } else {
                console.log('Unknown operation', op)
                break;
            }
            i++
        }
    }
}
