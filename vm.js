module.exports = {
    start: function() {
        let load = require('./load')()
        var api = require('./ops')(load)

        var i = 0
        while (i < api.memory.length) {
            let op = api.memory[i]
            if (op < api.ops.length) {
                var opFunc = api[api.ops[op]]
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
