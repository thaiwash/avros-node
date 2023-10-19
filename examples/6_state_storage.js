// Notes: This feature is underconstruction
// Using database MYSQL
/*
Save properties:
object type, position, scale, rotation, id, parent
object texture, id, base64.
*/



require("../src/main.js")
var instance = new AVROS.Serve(8089)
instance.AppInformation("Database example", "res/icons8-database-64.png")

instance.ActivateMYSQL({
 "host": "127.0.0.1",
 "user":"root",
 "password": "password",
 "database": "avros"
})

var cube = new AVROS.Thing("Cube")

cube.set({
	"id": 11011,
	"database": true,
	"type": "cube",
	"scale": {
		"x": 0.1,
		"y": 0.1,
		"z": 0.1
	}
})

instance.on("player enter", function(ws) {
	
  console.log("Player " + ws.userName + " entered")
  //instance.LoadStateFromMYSQL()
  instance.SpawnAsInterest(ws, cube)

  instance.AddTag(ws, cube, "Grabable")
  instance.AddTag(ws, cube, "Scalable")
})

instance.on("object changed", function(ws) {
	console.log("object update called")
	//instance.SaveObjectToMysql()
})