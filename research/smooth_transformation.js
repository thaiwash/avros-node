var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

// File cube = 11011
var cube = {
  "type": "cube",
  "id": 11011,
  "scale": {
    "x": 0.1,
    "y": 0.1,
    "z": 0.1
  }
}
instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")
  instance.SpawnAsInterest(player, cube)
  setTimeout(function() {
    var obj = instance.GetObjectById(11011)

    var transform = {
      "posX": parseFloat(obj.posX) + 5 + "",
      "posY": obj.posY,
      "posZ": obj.posZ,
      "rotX": 0+"",
      "rotY": 0+"",
      "rotZ": 0+"",
      "rotW": 1+"",
      "scaleX":0.4+"",
      "scaleY":0.4+"",
      "scaleZ":0.4+"",
      "start_time": Date.now()+"",
      "transform_time": 10000+"",
      "object_id": 11011+""
    }

    console.log(transform)

    instance.io.sockets.emit("object transform", transform)
  },1000)
})
