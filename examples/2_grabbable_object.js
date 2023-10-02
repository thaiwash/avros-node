require("../src/main.js")
var instance = new AVROS.Serve(80)
instance.AppInformation("Tester")

var thing = new AVROS.Thing("My thing")
thing.set({
  "type": "cube",
  "object_id": 11011,
  "scale": {
    "x": "0.1",
    "y": "0.1",
    "z": "0.1"
  }
})



instance.on("player enter", function(ws) {
  console.log("Player " + ws.UserName + " entered")

  instance.SpawnAsInterest(ws, thing)

  // we now make code scalable and grabbable.
  instance.AddTag(ws, thing, "Grabable")
  instance.AddTag(ws, thing, "Scalable")
})