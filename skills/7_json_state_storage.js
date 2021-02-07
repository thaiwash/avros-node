// notes: save file not working.
// Maybe I should refacture the NWK monitor
// Restoring session after crash object position changes a lot.. maybe wait before calling PlayerEnter



var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")
instance.ActivateJSONDatabase("../research/db_file.json")

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

  instance.io.sockets.emit("add tag", {
    "object_id": cube.id + "",
    "tag": "Grabable"
  })

  instance.io.sockets.emit("add tag", {
    "object_id": cube.id + "",
    "tag": "Scalable"
  })
})
