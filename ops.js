const fs = require('fs')

let input = null

let api = {
    ops: ['halt', 'set', 'push', 'pop', 'eq', 'gt', 'jmp',
        'jt', 'jf', 'add', 'mult', 'mod', 'and', 'or', 'not',
        'rmem', 'wmem', 'call', 'ret', 'out', 'in', 'noop'],

    //halt: 0 - stop execution and terminate the program
    halt: () => {
        process.exit()
    },

    //set: 1 a b - set register <a> to the value of <b>
    set: (a, b) => setRegister(a, value(b)),

    //push: 2 a - push <a> onto the stack
    push: a => {
        api.stack.push(value(a))
    },

    //pop: 3 a - remove the top element from the stack and write it into <a>; empty stack = error
    pop: a => {
        if (api.stack.length) setRegister(a, api.stack.pop())
        else console.log('POP: empty stack!')
    },

    //eq: 4 a b c - set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
    eq: (a, b, c) => setRegister(a, +(value(b) === value(c))),

    //gt: 5 a b c - set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
    gt: (a, b, c) => setRegister(a, +(value(b) > value(c))),

    //jmp: 6 a - jump to <a>
    jmp: a => value(a) - 1,

    //jt: 7 a b - if <a> is nonzero, jump to <b>
    jt: (a, b) => value(a) !== 0 ? value(b) - 1 : null,

    //jf: 8 a b - if <a> is zero, jump to <b>
    jf: (a, b) => value(a) === 0 ? value(b) - 1 : null,

    //add: 9 a b c - assign into <a> the sum of <b> and <c> (modulo 32768)
    add: (a, b, c) => setRegister(a, fixMath(value(b) + value(c))),

    //mult: 10 a b c - store into <a> the product of <b> and <c> (modulo 32768)
    mult: (a, b, c) => setRegister(a, fixMath(value(b) * value(c))),

    //mod: 11 a b c - store into <a> the remainder of <b> divided by <c>
    mod: (a, b, c) => setRegister(a, value(b) % value(c)),

    //and: 12 a b c - stores into <a> the bitwise and of <b> and <c>
    and: (a, b, c) => setRegister(a, value(b) & value(c)),

    //or: 13 a b c - stores into <a> the bitwise or of <b> and <c>
    or: (a, b, c) => setRegister(a, value(b) | value(c)),

    //not: 14 a b - stores 15-bit bitwise inverse of <b> in <a>
    not: (a, b) => setRegister(a, value(b) ^ 65535 % 32768),

    //rmem: 15 a b - read memory at address <b> and write it to <a>
    rmem: (a, b) => setRegister(a, api.memory[value(b)]),

    //wmem: 16 a b - write the value from <b> into memory at address <a>
    wmem: (a, b) => {
        api.memory[value(a)] = value(b)
    },

    //call: 17 a - write the address of the next instruction to the stack and jump to <a>
    call: (a, ...i) => {
        if (api.memory[i[0] + 1] !== 18) api.stack.push(i[0] + 1)
        return value(a) - 1
    },

    //ret: 18 - remove the top element from the stack and jump to it; empty stack = halt
    ret: () => {
        if (api.stack.length) return api.stack.pop() - 1
        else console.log('RET: empty stack!')
    },

    //out: 19 a - write the character represented by ascii code <a> to the terminal
    out: a => {
        process.stdout.write(String.fromCharCode(value(a)))
    },

    //in: 20 a - read a character from the terminal and write its ascii code to <a>
    in: a => {
        if (!input) {
            input = require('readline-sync').prompt() + '\n'
        }

        //custom added commands
        let commands = {
            'autoplay': () => {
                return require('./spoilers/autoplay.json').join('\n') + '\n'
            },
            'hack coins': () => {
                //load answer calculated from coin.js
                console.log('Hacking coins...', input)
                return require('./spoilers/coin')
            },
            'hack orb': () => {
                console.log('hacking orb...')
                return require('./spoilers/orb')
            },
            'hack teleporter': () => {
                console.log('Hacking teleporter...')

                //load answer calculated from teleporter.js
                let answer = require('./spoilers/teleporter')

                //skip first part of the check
                api.memory[5451] = 21
                api.memory[5452] = 21
                api.memory[5453] = 21

                //set register 0 value to 6 for check at 5491
                api.memory[5485] = 6

                //set register 7 to the correct value using some existing NOOPs
                api.memory[5487] = 32775
                api.memory[5488] = answer

                //skip second part of the check
                api.memory[5489] = 21
                api.memory[5490] = 21

                return 'use teleporter\n'
            },
            'write memory': () => {
                let outputPath = './bin/savedmemory.bin'
                let buffer = Buffer.allocUnsafe(api.memory.length * 2)
                api.memory.forEach((v, i) => buffer.writeUInt16LE(v, i * 2))
                fs.writeFileSync(outputPath, buffer)
                console.log('Memory saved.')
            },
            save: () => {
                fs.writeFileSync('./spoilers/save.json', JSON.stringify({
                    memory: api.memory,
                    register: api.register,
                    stack: api.stack
                }))
            },
            load: () => {
                let save = JSON.parse(fs.readFileSync('./spoilers/save.json', 'utf8'))
                api.memory = save.memory
                api.register = save.register
                api.stack = save.stack
            },
            exit: api.halt
        }

        let current = input.match(/^([^\n]+)\n*/)
        if (current && commands.hasOwnProperty(current[1])) {
            input = input.replace(current[0], '')
            let more = commands[current[1]]()
            input = more + input
        }

        let b = input.slice(0, 1)
        input = input.slice(1)
        let c = b.charCodeAt(0)
        setRegister(a, c)
    },

    //noop: 21 - no operation
    noop: () => {}
}

function value(i) {
    if (i >= 32768 && i <= 32775) {
        return api.register[i - 32768]
    } else if (i < 32768) {
        return i
    }
}

let setRegister = (a, b) => {
    api.register[a - 32768] = b
}
let fixMath = a => a >= 32768 ? a % 32768 : a

module.exports = api

