var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

var cubeId = instance.GenerateId()
var planeId = instance.GenerateId()

// Example cube
var cube = {
  "id": cubeId,
  "type": "cube",
  "scale": {
    "x": "0.1",
    "y": "0.1",
    "z": "0.01"
  },
  "properties": [ // Not implemented yet
    "Grabable",
    "Scalable"
  ],
  "children": [{
    "id": planeId,
    "type": "plane",
    "position": {
      "x": "0.0",
      "y": "0.0",
      "z": "-0.51"
    },
    "scale": {
      "x": "0.1",
      "y": "0.1",
      "z": "0.1"
    },
    "rotation": {
      "x": "90",
      "y": "180",
      "z": "0"
    }
  }]
}

const {
  createCanvas,
  loadImage
} = require('canvas')


var canvas = createCanvas(200, 200)
var ctx = canvas.getContext('2d')



instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")
  instance.SpawnAsInterest(player, cube)

  instance.AddTag(cubeId, "Grabable")
  instance.AddTag(cubeId, "Scalable")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, 200, 200)

  ctx.fillStyle = "#000000"
  ctx.font = '30px Impact'
  ctx.fillText('Awesome!', 50, 100)

  loadImage('res/icons8-test-tube-48.png').then(function(img) {
    ctx.drawImage(img, 10, 10, 48, 48)
    instance.SetTexture(planeId, canvas)
  })

})