var debug = i => i

function value(i) {
    if (i >= 32768 && i <= 32775) {
        debug('Reading register', i)
        return register[i - 32768]
    } else if (i <= 32767) {
        return i
    } else {
        debug('Unknown value:', i)
    }
}

function setRegister(a, b) {
    debug('Setting register', a, b)
    register[a - 32768] = b
}

var register = [0, 0, 0, 0, 0, 0, 0, 0]
var stack = []
var memory = require('./load')
var i = 0
while (i < memory.length) {
    var op = memory[i]
    var a, b, c, d

    if (op === 0) {
        //halt: 0 - stop execution and terminate the program
        debug('Halting...')
        break;
    } else if (op === 1) {
        //set: 1 a b - set register <a> to the value of <b>
        a = memory[++i]
        b = value(memory[++i])

        debug('Setting register', a, '=', b)
        setRegister(a, b)
    } else if (op === 2) {
        //push: 2 a - push <a> onto the stack
        a = value(memory[++i])

        debug('Pushing onto stack', a)
        stack.push(a)
    } else if (op === 3) {
        //pop: 3 a - remove the top element from the stack and write it into <a>; empty stack = error
        a = memory[++i]

        if (stack.length) {
            b = stack.pop()
            debug('Popping off stack', a, '=', b)
            setRegister(a, b)
        } else {
            debug('Pop off empty stack!')
        }
    } else if (op === 4) {
        //eq: 4 a b c - set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        debug('Equal check', a, b, c, b === c)
        setRegister(a, +(b === c))
    } else if (op === 5) {
        //gt: 5 a b c - set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        debug('GT check', a, b, c, b > c)
        setRegister(a, +(b > c))
    } else if (op === 6) {
        //jmp: 6 a - jump to <a>
        a = value(memory[++i])
        debug('jmp', a)
        i = a - 1
    } else if (op === 7) {
        //jt: 7 a b - if <a> is nonzero, jump to <b>
        a = value(memory[++i])
        b = value(memory[++i])

        if (a !== 0) {
            debug('jt', a, b)
            i = b - 1
        } else {
            debug('jt-no', a, b)
        }
    } else if (op === 8) {
        //jf: 8 a b - if <a> is zero, jump to <b>
        a = value(memory[++i])
        b = value(memory[++i])

        if (a === 0) {
            debug('jf', a, b)
            i = b - 1
        } else {
            debug('jf-no', a, b)
        }
    } else if (op === 9) {
        //add: 9 a b c - assign into <a> the sum of <b> and <c> (modulo 32768)
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        d = b + c
        d = d >= 32768 ? d % 32768 : d
        debug('Add', a, b, c, d)
        setRegister(a, d)
    } else if (op === 10) {
        //mult: 10 a b c - store into <a> the product of <b> and <c> (modulo 32768)
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        d = b * c
        d = d >= 32768 ? d % 32768 : d
        debug('Multiply', a, b, c, d)
        setRegister(a, d)
    } else if (op === 11) {
        //mod: 11 a b c - store into <a> the remainder of <b> divided by <c>
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        debug('Modulus', a, b, c)
        setRegister(a, b % c)
    } else if (op === 12) {
        //and: 12 a b c - stores into <a> the bitwise and of <b> and <c>
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        debug('Bitwise AND', a, b, c, b & c)
        setRegister(a, b & c)
    } else if (op === 13) {
        //or: 13 a b c - stores into <a> the bitwise or of <b> and <c>
        a = memory[++i]
        b = value(memory[++i])
        c = value(memory[++i])

        debug('Bitwise OR', a, b, c, b | c)
        setRegister(a, b | c)
    } else if (op === 14) {
        //not: 14 a b - stores 15-bit bitwise inverse of <b> in <a>
        a = memory[++i]
        b = value(memory[++i])

        debug('Bitwise NOT', a, b, b ^ 65535)
        setRegister(a, b ^ 65535 % 32768)
    } else if (op === 15) {
        //rmem: 15 a b - read memory at address <b> and write it to <a>
        a = memory[++i]
        b = value(memory[++i])
        c = memory[b]

        debug('ReadMem', a, b, c)
        setRegister(a, c)
    } else if (op === 16) {
        //wmem: 16 a b - write the value from <b> into memory at address <a>
        a = value(memory[++i])
        b = value(memory[++i])

        debug('WriteMem', a, b)
        memory[a] = b
    } else if (op === 17) {
        //call: 17 a - write the address of the next instruction to the stack and jump to <a>
        a = value(memory[++i])

        debug('Call', a)
        stack.push(++i)
        i = a - 1
    } else if (op === 18) {
        //ret: 18 - remove the top element from the stack and jump to it; empty stack = halt
        if (stack.length) {
            a = stack.pop()
            i = a - 1
        } else {
            debug('Return empty stack!')
        }
    } else if (op === 21) {
        //noop: 21 - no operation
    } else if (op === 19) {
        //out: 19 a - write the character represented by ascii code <a> to the terminal
        a = value(memory[++i])
        process.stdout.write(String.fromCharCode(a))
    } else {
        console.log('Unknown operation', op, 'Halting...')
        break;
    }
    i++
}
