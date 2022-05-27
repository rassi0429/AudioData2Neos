var tone = require('tonegenerator');
var header = require('waveheader');
var fs = require('fs');

var zero = tone({ freq: 427, lengthInSecs: 1, volume: tone.MAX_16 })
var low = tone({ freq: 400, lengthInSecs: 1, volume: tone.MAX_16 })
var high = tone({ freq: 427, lengthInSecs: 1, volume: tone.MAX_16 })

const text = process.argv[2]
var file = fs.createWriteStream(`${text}.wav`)
function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}
function zp(NUM, LEN = 8) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
}

var myBuffer = [];
for (let i = 0; i < text.length; i++) {
    myBuffer.push(zp(dec2bin(text.charCodeAt(i))))
}
const binary = myBuffer.join("")
console.log(binary)
const dataArray = []
var res = [...zero]
for (let i = 0; i < binary.length; i++) {
    if(binary[i] === "1") {
        res.push(...high)
    } else {
        res.push(...low)
    }
}
console.log(res.length)

file.write(header(res.length * 2, {
    bitDepth: 16
}))

var data = Int16Array.from(res)

var size = data.length * 2 // 2 bytes per sample
if (Buffer.allocUnsafe) { // Node 5+
    buffer = Buffer.allocUnsafe(size)
} else {
    buffer = new Buffer(size)
}

data.forEach(function (value, index) {
    buffer.writeInt16LE(value, index * 2)
})

file.write(buffer)