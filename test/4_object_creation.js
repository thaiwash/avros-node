var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

// File cube = 11011
var fileCube = {"type": "cube", "id": 11011}
instance.on("player enter", function(player) {
  console.log("Player "+player+" entered")
  instance.SpawnAsInterest(player, fileCube)
})
