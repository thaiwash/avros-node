// In this example, we are going to load a unity asset from the server

// this feature was discontinued until futher notice, since it requires SSL

require("../src/main.js")
var instance = new AVROS.Serve(8080)
instance.AppInformation("Test 4")
instance.ConnectingDebug = false;

var cubeId = instance.GenerateId()
var planeId = instance.GenerateId()

var assetId = instance.GenerateId()

var asset = new AVROS.Thing("Cardroom")

asset.set({
	"id": assetId,
	"type": "asset",
	"name": "cardroom"
})

var cube = new AVROS.Thing("Cube")


cube.set({
	"id": cubeId,
	"type": "cube",
	"scale": {
		"x": 0.1,
		"y": 0.1,
		"z": 0.04
	}
})

var plane = new AVROS.Thing("Plane")

plane.set({
	"id": planeId,
	"type": "plane",
	"parent": cubeId,
	"scale": {
		"x": 0.1,
		"y": 0.1,
		"z": 0.1
	},
	"position": {
	  "x": 0.0,
	  "y": 0.0,
	  "z": -0.51
	},
    "eulerRotation": {
      "x": 90,
      "y": 180,
      "z": 0
    }
})


const {
  createCanvas,
  loadImage
} = require('canvas')


var canvas = createCanvas(200, 200)
var ctx = canvas.getContext('2d')


instance.on("user enter", function(ws) {
  console.log("User " + ws.UserName + " entered")
  instance.SpawnAsInterest(ws, cube)
  instance.SpawnAsInterest(ws, asset)
  instance.DescribeObject(ws, plane)

  instance.AddTag(ws, cube, "Grabable")
  instance.AddTag(ws, cube, "Scalable")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, 200, 200)

  ctx.fillStyle = "#000000"
  ctx.font = '15px Impact'
  ctx.fillText('Loading unity asset', 20, 100)

  loadImage('res/icons8-test-tube-48.png').then(function(img) {
    ctx.drawImage(img, 10, 10, 48, 48)
    instance.SetTexture(ws, plane, canvas)
  })

})

instance.app.get('/cardroom', function(req, res) {
  res.send(fs.readFileSync('asset/cardroom'));
  res.end();
})