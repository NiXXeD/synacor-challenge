const _ = require('lodash')
const fs = require('fs')
    
//load file into memory
let filename = './spoilers/savedmemory.bin'
let buffer = fs.readFileSync(filename)
let memory = _.range(buffer.length / 2)
    .map(offset => buffer.readUInt16LE(offset * 2))

//object to store extracted values
let data = {}

//extract self check strings
data.selfCheck = extract(6068, 6125)

//extract rooms
data.rooms = {
    foothills: extractRoomData(2317, 29)
        .concat(extractRoomData(2648, 4)),
    synacor: extractRoomData(2488, 2),
    beach: extractRoomData(2498, 30)
}

//extract items
data.items = extract(18062, 25866)
    .reduce((acc, val, i) => {
        if (i % 2 === 0) acc.name = val
        else acc.arr.push({name: acc.name, desc: val})
        return acc
    }, {arr: []}).arr

//extract misc
data.misc = extract(25866, 25943)

//extract actions
data.actions = extract(25943, 25974)

//extract orb stuff
data.orbs = extract(26007, 26850)

//write file out
fs.writeFileSync('./spoilers/extracted.json', JSON.stringify(data, null, 2))

/**
 * Extract room string data.
 * @param offset The offset to start at.
 * @param count How many rooms to extract.
 * @returns {*} An array of room data.
 */
function extractRoomData(offset, count) {
    return _.range(0, count)
        .map(room => {
            let i = offset + (room * 5)
            let start = memory[i]
            let end = memory[i+1]
            let name = extract(start, end)[0]
            let desc = extract(end, end + 1)[0]

            let exitDataStart = memory[i+2]
            let exitDataEnd = memory[i+3]
            let exitCount = memory[exitDataStart]
            let exits = _.range(exitDataStart + 1, exitDataEnd)
                .map(i => memory[i])
                .map(i => extract(i, i+1)[0])

            return {id: start, name, desc, exitCount, exits}
        })
}

/**
 * Extract data from memory.
 * @param start Starting offset.
 * @param end Ending offset.
 * @returns {Array} String array that was read.
 */
function extract(start, end) {
    let values = []
    let i = start
    let len
    do {
        len = memory[i++]
        let value = _.range(i, i + len)
            .map(i => memory[i])
            .map(c => String.fromCharCode(c))
            .join('')
        values.push(value)

        i = i + len
    } while (len > 0 && i < end)
    return values
}
