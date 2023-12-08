require("../src/main.js")
var instance = new AVROS.Serve(8888)
instance.AppInformation("Grab test", "res/icons8-grab-48.png")

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



instance.on("user enter", function(ws) {
  console.log("User entered")

  instance.SpawnAsInterest(ws, thing)

  // we now make code scalable and grabbable.
  instance.AddTag(ws, thing, "Grabable")
  instance.AddTag(ws, thing, "Scalable")
})