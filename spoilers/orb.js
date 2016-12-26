const _ = require('lodash')

let grid = [
    ['*', 8, '-', 1],
    [4, '*', 11, '*'],
    ['+', 4, '-', 18],
    ['', '-', 9, '*']
]

let answer
let initial = {
    x: 0, y: 3,
    orb: 22,
    op: '',
    history: []
}
let queue = [initial]
while (queue.length) {
    let {x, y, orb, op, history} = _.cloneDeep(queue.pop())

    let current = grid[y][x]
    if (_.isNumber(current)) {
        if (op === '+') {
            orb += +current
        } else if (op === '*') {
            orb *= +current
        } else if (op === '-') {
            orb -= +current
        }
        op = ''
    } else {
        op = current
    }

    if (x === 3 && y === 0) {
        if (orb === 30) {
            answer = history
            break
        }
    } else if (orb > 0 && orb < 75 && history.length < 12) {
        if (y > 0) {
            queue.unshift({x, y: y - 1, orb, op, history: history.concat(['north'])})
        }
        if (x < 3) {
            queue.unshift({x: x + 1, y, orb, op, history: history.concat(['east'])})
        }
        if (y < 3 && x > 0) {
            queue.unshift({x, y: y + 1, orb, op, history: history.concat(['south'])})
        }
        if (x > 0 && y < 3) {
            queue.unshift({x: x - 1, y, orb, op, history: history.concat(['west'])})
        }
    }
}

module.exports = ['take orb', ...answer, 'vault'].join('\n') + '\n'
