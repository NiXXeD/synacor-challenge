module.exports = {
    start: function() {
        let load = require('./load')()
        let api = require('./ops')(load)

        let i = 0
        while (i < api.memory.length) {
            let op = api.memory[i]
            if (op < api.ops.length) {
                let opFunc = api[api.ops[op]]
                let args = [...Array(opFunc.length)].map(() => api.memory[++i]).concat([i])
                i = opFunc(...args) || i
            } else {
                console.log('Unknown operation', op)
                break;
            }
            i++
        }
    }
}
