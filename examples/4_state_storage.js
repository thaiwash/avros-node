// Notes: This feature is underconstruction
// Using database MYSQL
/*
Save properties:
object type, position, scale, rotation, id, parent
object texture, id, base64.
*/



require("../src/main.js")
var instance = new AVROS.Serve(80)
instance.AppInformation("Tester")
instance.ActivateJSONDatabase("../research/db_file.json")

var cube = new AVROS.Thing("Cube")

cube.set({
	"id": 11011,
	"type": "cube",
	"scale": {
		"x": 0.1,
		"y": 0.1,
		"z": 0.1
	}
})

instance.on("player enter", function(ws) {
	
  console.log("Player " + ws.userName + " entered")

  instance.SpawnAsInterest(ws, cube)

  instance.AddTag(ws, cube, "Grabable")
  instance.AddTag(ws, cube, "Scalable")
})