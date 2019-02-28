/* todo fix eof tilde confusion */
console.log("including sockets")
var socket = require('socket.io-client')('http://51.38.185.65:9774');
var fs = require("fs")
var waterfall = require('async-waterfall');

var appId  = 7357
socket.on('connect', function(){});
socket.on('disconnect', function(){});

var connected = false

socket.on('connection accepted', function(){
    console.log("connected")
    start()
    connected = true
})

setTimeout(function() {
    if (!connected) {
        console.log("failed to connect")
        process.exit(0)
    }
}, 5000)

socket.on("load matrix", function (data) {
    console.log("loading matrix")
start()
})

var cube = {
    "object_id": "717",
    "type": "cube",
    "posX": "-0.1153316",
    "posY": "-0.01580912",
    "posZ": "-0.1566545",
    "rotW": "-0.2689151",
    "rotX": "-0.2196632",
    "rotY": "0.8342858",
    "rotZ": "-0.4282523",
    "scaleX": "0.2000001",
    "scaleY": "0.2000001",
    "scaleZ": "0.02000001",
    "user_id": "7357"
}
var plane = {
    "object_id": "17",
    "type": "plane",
    "parent": "717",
    "posX": "0",
    "posY": "0",
    "posZ": "-0.6",
    "rotW": "-3.090862E-08",
    "rotX": "-3.090862E-08",
    "rotY": "-0.7071068",
    "rotZ": "0.7071068",
    "scaleX": "0.1",
    "scaleY": "0.1",
    "scaleZ": "0.1",
    "user_id": "7357"
}

function start() {
    waterfall([
      function(callback){
          console.log("testing audio")
          socket.emit("tts", {"say": "testing debugger audio"})
          setTimeout(function() {
              callback(null)
          }, 2000)
      },
      function(callback){
          socket.emit("tts", {"say": "testing gameobject spawn"})


          socket.emit("object created", cube)
          setTimeout(function() {
                callback(null)
          }, 10000)
      },
      function(callback){
          socket.emit("tts", {"say": "testing gameobject plane spawn"})


          socket.emit("object created", plane)
          setTimeout(function() {
                callback(null)
          }, 10000)
      },
      function(callback){
                callback(null)
          }, 10000)
      },
      function(callback){
          socket.emit("tts", {"say": "testing gameobject despawn"})

          socket.emit("object destroyed", cube)
          setTimeout(function() {
                callback(null)
          }, 10000)
      }
    ], function (err, result) {
        socket.emit("tts", {"say": "all test complete, exiting"})
        process.exit(0)
    });
}