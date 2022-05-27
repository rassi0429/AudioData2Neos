var tone = require('tonegenerator');
var header = require('waveheader');
var fs = require('fs');

var zero = tone({ freq: 800, lengthInSecs: 1, volume: tone.MAX_16 })

var late = Number(process.argv[3])

var low = tone({ freq: 400, lengthInSecs: 1 / late, volume: 5000 })
var high = tone({ freq: 400, lengthInSecs: 1 / late, volume: tone.MAX_16 })

var silent = tone({ freq: 400, lengthInSecs: (0.35 / late), volume: 2000 })
var bit = tone({ freq: 400, lengthInSecs: (0.3 / late), volume: tone.MAX_16 })
const prefixTmp = [...silent, ...bit, ...silent]
const res = [...prefixTmp, ...prefixTmp, ...prefixTmp, ...prefixTmp, ...prefixTmp, ...prefixTmp, ...prefixTmp, ...prefixTmp, ...high]

const text = process.argv[2]
var file = fs.createWriteStream(`${text}_${late}.wav`)
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
for (let i = 0; i < binary.length; i++) {
    if (binary[i] === "1") {
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