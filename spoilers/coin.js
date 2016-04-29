let coins = [2, 3, 5, 7, 9]
let labels = {2: 'red', 3: 'corroded', 5: 'shiny', 7: 'concave', 9: 'blue'}
let perms = require('js-combinatorics').permutation(coins)
let solution = perms.filter(p => (p[0] + p[1] * Math.pow(p[2], 2) + Math.pow(p[3], 3) - p[4]) === 399)[0]
console.log('Use the coins in the following order:', solution.map(i => labels[i]).join(', '))
