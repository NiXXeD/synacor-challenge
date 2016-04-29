// If only we had TCO in JS...
// function recursion(r0, r1) {
//     if (r0 === 0) {
//         return (r1 + 1) % 32768
//     } else if (r1 === 0) {
//         return check(r0 - 1, r7)
//     } else {
//         return check(r0 - 1, check(r0, r1 - 1))
//     }
// }

/**
 * Store all the previously calculated answers in a json file 'answers.json'
 */
const lowdb = require('lowdb')
const storage = require('lowdb/file-sync')
const db = lowdb('./spoilers/answers.json', {storage})

/**
 * Build a table of the results without recursion.
 * @param r7 The final register value to test.
 * @returns {*} The final result from the check (should equal 6).
 */
function check(r7) {
    let cache = {}
    for (let i = 0; i <= 32768; i++) {
        cache[`${0},${i}`] = (i + 1) % 32768
    }

    for (let r0 = 1; r0 < 5; r0++) {
        cache[`${r0},${0}`] = cache[`${r0 - 1},${r7}`]

        for (let r1 = 1; (r1 < 32768 && r0 < 4) || (r1 < 2 && r0 === 4); r1++) {
            cache[`${r0},${r1}`] = cache[`${r0 - 1},${cache[`${r0},${r1 - 1}`]}`]
        }
    }

    console.log(`check(${r7}) = ${cache['4,1']}`)
    db('answers').push({i: r7, o: cache['4,1']})
    return cache['4,1']
}

/**
 * Test all values from 0->37768
 * @returns {*} The solution for the teleporter problem.
 */
module.exports = (function() {
    let answer = db('answers').find({o: 6})
    if (!answer) {
        console.log('Calculating register 7 value...')
        for (let i = 1; i < 32768; i++) {
            if (!db('answers').find({i})) {
                let result = check(i)
                if (result === 6) break
            }
        }
    }

    answer = db('answers').find({o: 6}) || {i: 0}
    console.log(`Found correct register 7 value: ${answer.i}`)
    return answer.i
})()
