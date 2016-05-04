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

let labels = inputLines
    .filter(line => _.startsWith(line, ':'))
    .map(label => ({
        name: label,
        instruction: null
    }))

//convert to values
let output = _(inputLines)
    .map(input => {
        let [, op, rest] = input.match(/(\S+)\s*(.+)*/)
        rest = rest || ''

        if (op === 'PRINT') {
            rest = rest.replace(/\\n/g, '\n') //fix fake newlines
            return _.flatten(rest.split``.map(s => ([19, s.charCodeAt(0)])))
                .concat([19, 10]) //extra new line at end
        } else if (_.startsWith(op, ':')) {
            return `:${op}` //make original label easier to find later
        } else {
            let code = _.indexOf(ops, op.toLowerCase())
            return [code].concat(rest.split(' '))
        }
    })
    .flatten()

    //registers
    .map(value => {
        if (/(a|b|c|d|e|f|g|h)x/i.test(value)) {
            return value.toLowerCase().charCodeAt(0) + 32671
        }
        return value
    })

    //labels
    .map((value, index) => {
        if (_.startsWith(value, '::')) {
            let label = _.find(labels, {name: value.slice(1)}) || {}
            label.instruction = index
            return 21
        }
        return value
    })
    .map(value => {
        if (_.startsWith(value, ':')) {
            let label = _.find(labels, {name: value}) || {}
            return label.instruction + 1
        }
        return value
    })

    //ensure all numbers at the end
    .map(value => +value)
    .value()

//write to file
let buffer = Buffer.allocUnsafe(output.length * 2)
output.forEach((v, i) => buffer.writeUInt16LE(v, i * 2))
fs.writeFileSync(outputPath, buffer)
