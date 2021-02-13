var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

// Example cube
var cube = {
  "type": "empty",
  "children": [{
    "type": "cube",
    "scale": {
      "x": "0.1",
      "y": "0.1",
      "z": "0.1"
    },
    "children": [{
      "type": "plane",
      "scale": {
        "x": "0.01",
        "y": "0.01",
        "z": "0.01"
      }
    }]
  }]
}

instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")
  instance.SpawnAsInterest(player, cube)
})