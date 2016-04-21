var debug = false
module.exports = {
    start: function(bin) {
        let load = require('./load')(bin)
        var ops = require('./ops')(load.register, load.stack, load.memory)

        var i = 0
        while (i < ops.memory.length) {
            let op = ops.memory[i]
            if (op < ops.ops.length) {
                var opFunc = ops[ops.ops[op]]
                let args = [...Array(opFunc.length)].map(() => ops.memory[++i]).concat([i])
                if (debug) {
                    var lineNo = args.slice(-1)[0]
                    var fixedArgs = args.slice(0, args.length-1)
                    console.log(lineNo, ops.ops[op].toUpperCase(), ...fixedArgs)
                    var input, m
                    do {
                        input = require('readline-sync').prompt()

                        if (input.startsWith('readreg')) {
                            console.log('Registers:', ops.register)
                        } else if (input.startsWith('writemem')) {
                            console.log('Writing memory at location:', input)
                            m = input.match(/(\w+)/g)
                            ops.memory[+m[1]] = +m[2]
                        } else if (input.startsWith('writereg')) {
                            console.log('Setting register:', input)
                            m = input.match(/(\w+)/g)
                            ops.register[+m[1]] = +m[2]
                        } else if (input.startsWith('readstack')) {
                            console.log('Stack:', ops.stack)
                        } else if (input.startsWith('readmem')) {
                            m = input.match(/(\w+)/g)
                            console.log('Memory at location:', m[1], ops.memory[m[1]])
                        } else if (input === 'exit') {
                            process.exit()
                        } else if (input === 'resume') {
                            debug = false
                        }
                    } while (input)
                }
                i = opFunc(...args) || i
                if (typeof i === 'object') {
                    debug = true
                    i = i.i
                }
            } else {
                console.log(i, 'Unknown operation', op)
                break;
            }
            i++
        }
    }
}
