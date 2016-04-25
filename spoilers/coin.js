//red = 2, corroded = 3, shiny = 5, concave = 7, blue = 9
var coins = [2, 3, 5, 7, 9]
var perms = require('js-combinatorics').permutation(coins)
var solution = perms.filter(p => (p[0] + p[1] * Math.pow(p[2], 2) + Math.pow(p[3], 3) - p[4]) === 399)
console.log(solution)
