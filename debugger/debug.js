require("../src/main.js")
var instance = new AVROS.Serve(8090)
instance.AppInformation("Bughunter", "bughunt_icon.png")

var cubeId = instance.GenerateId()
var planeId = instance.GenerateId()

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


var canvas = createCanvas(500, 500)
var ctx = canvas.getContext('2d')



instance.on("user enter", function(ws) {
  console.log("User " + ws.UserName + " entered")
  instance.SpawnAsInterest(ws, cube)
  instance.DescribeObject(ws, plane)

  instance.AddTag(ws, cube, "Grabable")
  instance.AddTag(ws, cube, "Scalable")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, 500, 500)

  ctx.fillStyle = "#000000"
  ctx.font = '15px Impact'
  ctx.fillText('Bughunter', 70, 50)
  
  ctx.fillStyle = "#000000"
  ctx.font = '8px Impact'
  ctx.fillText('Relevant bug:', 20, 70)
  ctx.fillText('Disconnect and reconnect causes a syncronization overload [Bug cleared (took 2 days to fix)]', 20, 100)
  ctx.fillText('Head text not clearing until disconnected. [This issue is probably caused by websocet asyncronicity issues, its not revelant enough to be fixed]', 20, 120)
  ctx.fillText('Sometimes after disconnect, connect button jams. (other connections still work)', 20, 140)

  loadImage('bughunt.png').then(function(img) {
    ctx.drawImage(img, 10, 10, 50, 50)
    instance.SetTexture(ws, plane, canvas)
  })

})
