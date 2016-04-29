// //if only we had TCO in JS...
// function recursion(r0, r1) {
//     if (r0 === 0) {
//         return (r1 + 1) % 32768
//     } else if (r1 === 0) {
//         return check(r0 - 1, r7)
//     } else {
//         return check(r0 - 1, check(r0, r1 - 1))
//     }
// }

function check(r7) {
    let cache = {}
    for (let i = 0; i <= 32768; i++) {
        cache[`${0},${i}`] = (i + 1) % 32768
    }

    for (let r0 = 1; r0 !== 5; r0++) {
        cache[`${r0},${0}`] = cache[`${r0 - 1},${r7}`]

        for (let r1 = 1; r1 < 32768; r1++) {
            let inner = cache[`${r0},${r1 - 1}`]
            cache[`${r0},${r1}`] = cache[`${r0 - 1},${inner}`]
        }
    }

    console.log(`${r7} = ${cache['4,1']} ${cache['4,1'] === 6 ? 'WINNER!' : ''}`)
    return cache['4,1']
}

let answer = [...Array(32768).keys()]
    .map(r7 => ({r7, a: check(r7)}))
    .find(r => r.a === 6).r7
console.log(`The correct setting for register 7 is ${answer}`)

