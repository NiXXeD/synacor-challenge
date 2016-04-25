// 5483 SET a 4
// 5486 SET b 1
// 5489 CALL 6027
//
// 5491 EQ b a 6
// 5495 JF b 5579
//
// 5498 PUSH 32768
// 5500 PUSH 32769
// 5502 PUSH 32770
// 5504 SET 32768 29014
// 5507 SET 32769 1531
// 5510 ADD 32770 2547 9227
// 5514 CALL 1458
//
// 6027 JT a 6035
// 6030 ADD a b 1
// 6034 RET
//
// 6035 JT b 6048
// 6038 ADD a a 32767
// 6042 SET b 32775
// 6045 CALL 6027
// 6047 RET
//
// 6048 PUSH a
// 6050 ADD b b 32767
// 6054 CALL 6027
//
// 6056 SET b a
// 6059 POP a
// 6061 ADD a a 32767
// 6065 CALL 6027
// 6067 RET


function test(reg7) {
    var fixMath = (a => a >= 32768 ? a % 32768 : a)
    var log = () => console.log(`a=${a} b=${b}`)
    var a = 4
    var b = 1
    f6027()
    if (a === 6) {
        console.log(reg7, a === 6 ? 'SUCCESS!' : 'FAILURE!')
    }

    function f6027() {
        if (a !== 0) {
            f6035()
        }
        a = fixMath(b + 1)
        // log()
    }

    function f6035() {
        if (b !== 0) {
            f6048()
        }
        a--
        // log()

        b = reg7
        // log()
    }

    function f6048() {
        var tempA = a

        b--
        // log()

        f6027()

        b = a
        // log()
        a = tempA
        // log()
        a--
        // log()

        f6027()
    }
}

for(var i=1; i<32768; i++) {
    test(i)
}
