//5483 SET a 4
//5486 SET b 1
//5489 CALL 6027
//
//5491 EQ b a 6       //b = (a === 6)
//5495 JF b 5579      //5579 = lose
//
//6027 JT a 6035
//6030 ADD a b 1      //b = a + 1
//6034 RET
//
//6035 JT b 6048
//6038 ADD a a 32767    //--a
//6042 SET b h          //b = h
//6045 CALL 6027
//6047 RET
//
//6048 PUSH a
//6050 ADD b b 32767    //--b
//6054 CALL 6027
//
//6056 SET b a          //b = a
//6059 POP a
//6061 ADD a a 32767
//6065 CALL 6027
//6067 RET

var h

var a = 4
var b = 1
