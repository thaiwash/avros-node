require("../src/main.js")
var instance = new AVROS.Serve(8080)
instance.AppInformation("Transform")

var thing = new AVROS.Thing("Tranforming cube")
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
  console.log("User" + ws.UserName + " entered")

  instance.SpawnAsInterest(ws, thing)
  var transform = thing.getTransform()
  
  // We will transform the position by -1
  transform.position.z -= 1
  
  // You may effect the rotatiom, scale and position of the object by transformation.
  
  // Transform time is 2 seconds by default
  // transform.time = 2000
  instance.TransformObject(ws, transform)

})