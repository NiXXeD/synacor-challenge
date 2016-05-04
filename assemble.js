const _ = require('lodash')
const fs = require('fs')
const ops = require('./ops').ops

//command line args
let inputPath = process.argv[2]
let outputPath = process.argv[3]

//split input into lines
let inputLines = fs.readFileSync(inputPath, 'utf8').trimRight().split(/\n/g)
inputLines = _.filter(inputLines, _.identity)
inputLines = _.filter(inputLines, line => !_.startsWith(line, '#'))

//convert to values
let output = _.flatten(inputLines.map(input => {
    let [, op, rest] = input.match(/(\S+)\s*(.+)*/)
    rest = rest || ''

    if (op === 'PRINT') {
        rest = rest.replace(/\\n/g, '\n') //fix fake newlines
        return _.flatten(rest.split``.map(s => ([19, s.charCodeAt(0)])))
            .concat([19, 10]) //extra new line at end
    } else {
        let code = _.indexOf(ops, op.toLowerCase())
        return [code].concat(rest.split(' ').map(s => +s))
    }
}))

//write to file
let buffer = Buffer.allocUnsafe(output.length * 2)
output.forEach((v, i) => buffer.writeUInt16LE(v, i * 2))
fs.writeFileSync(outputPath, buffer)
