require("../src/main.js")
var instance = new AVROS.Serve(9447)
instance.AppInformation("Tester")

var thing = new AVROS.Thing("My thing")

// File cube = 11011
thing.set({
  "type": "cube",
  "id": 11011,
  "scale": {
    "x": 0.1,
    "y": 0.1,
    "z": 0.1
  }
})

console.log(thing.getSocket())
instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")

  instance.SpawnAsInterest(player, thing)
})
