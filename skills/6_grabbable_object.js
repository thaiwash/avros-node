var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

var cube = {
  "type": "cube",
  "id": 11011,
  "scale": {
    "x": "0.1",
    "y": "0.1",
    "z": "0.1"
  }
}



instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")

  instance.SpawnAsInterest(player, cube)

  // we now make code scalable and grabbable.
  instance.AddTag(cube.id, "Grabable")
  instance.AddTag(cube.id, "Scalable")
})