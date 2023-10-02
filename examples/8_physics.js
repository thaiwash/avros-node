require("../src/main.js")
var instance = new AVROS.Serve(8080)
instance.AppInformation("Tester")

var cubeId = instance.GenerateId()

var cube = new AVROS.Thing("Cube")

cube.set({
	"id": cubeId,
	"type": "cube",
	"scale": {
		"x": 0.1,
		"y": 0.1,
		"z": 0.1
	}
})

instance.app.get('/cardroom', function(req, res) {
  res.send(fs.readFileSync('asset/cardroom'));
  res.end();
})