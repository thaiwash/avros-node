require("avros")
var instance = new AVROS.Serve(8888)
instance.AppInformation("Movement")

var floor = new AVROS.Thing("floor")

floor.set({
  "type": "cube",
  "scale": {
    "x": "20",
    "y": "0.1",
    "z": "20"
  },
  "position": {
    "x": "0",
    "y": "0",
    "z": "0"
  }
})

var ceiling = new AVROS.Thing("floor")

ceiling.set({
  "type": "cube",
  "scale": {
    "x": "20",
    "y": "0.1",
    "z": "20"
  },
  "position": {
    "x": "0",
    "y": "5",
    "z": "0"
  }
})

var walls = [
	new AVROS.Thing("wall1"), 
	new AVROS.Thing("wall2"),
	new AVROS.Thing("wall3"),
	new AVROS.Thing("wall4")
]

walls[0].set({
  "type": "cube",
  "scale": {
    "x": "0.1",
    "y": "20",
    "z": "20"
  },
  "position": {
    "x": "10",
    "y": "0",
    "z": "0"
  }
})

walls[1].set({
  "type": "cube",
  "scale": {
    "x": "0.1", // paksuus
    "y": "20", // korkeus
    "z": "20" // leveys
  },
  "position": {
    "x": "-10",
    "y": "0",
    "z": "0"
  }
})

walls[2].set({
  "type": "cube",
  "scale": {
    "x": "20",
    "y": "20",
    "z": "0.1"
  },
  "position": {
    "x": "0",
    "y": "0",
    "z": "10"
  }
})

walls[3].set({
  "type": "cube",
  "scale": {
    "x": "20",
    "y": "20",
    "z": "0.1"
  },
  "position": {
    "x": "0",
    "y": "0",
    "z": "-10"
  }
})
const {
  createCanvas,
  loadImage
} = require('canvas')


var canvas = createCanvas(864, 864)
var ctx = canvas.getContext('2d')

var wallpaperTextureCanvas = createCanvas(600, 600)
var wallpaperTextureCtx = wallpaperTextureCanvas.getContext('2d')

var ceilingTextureCanvas = createCanvas(390, 714)
var ceilingTextureCtx = ceilingTextureCanvas.getContext('2d')

instance.on("user enter", function(ws) {
	
	
  console.log("User entered")
  instance.DescribeObject(ws, floor)
  instance.DescribeObject(ws, ceiling)
  instance.DescribeObject(ws, walls[0])
  instance.DescribeObject(ws, walls[1])
  instance.DescribeObject(ws, walls[2])
  instance.DescribeObject(ws, walls[3])
  instance.MoveUser(ws, {"x": 0, "y": 1, "z": 0})
  instance.EnableMovement(ws, {"fromX": 9, "fromZ": 9, "toX": -9, "toZ": -9})
  
  
  //instance.DescribeObject(ws, MovementCube)
  //instance.AttachUser(ws, MovementCube)
  
  loadImage('texture/floor.png').then(function(img) {
	for (var x = 0; x < 10; x ++){
		for (var y = 0; y < 10; y ++){
			ctx.drawImage(img, x*(864/10), y*(864/10), 864/10, 864/10)
		} 
	} 
	  
	
    instance.SetTexture(ws, floor, canvas)
    instance.SetTexture(ws, ceiling, canvas)
  })
  
  loadImage('texture/wallpaper.jpg').then(function(img) {
	  
	for (var x = 0; x < 10; x ++){
		for (var y = 0; y < 1; y ++){
			wallpaperTextureCtx.drawImage(img, x*(600/10), y*(600), 600/10, 600)
		} 
	} 
	  
    instance.SetTexture(ws, walls[0], wallpaperTextureCanvas)
    instance.SetTexture(ws, walls[1], wallpaperTextureCanvas)
    instance.SetTexture(ws, walls[2], wallpaperTextureCanvas)
    instance.SetTexture(ws, walls[3], wallpaperTextureCanvas)
    instance.SetTexture(ws, ceiling, wallpaperTextureCanvas)
  })
  
  loadImage('texture/ceiling3.jpg').then(function(img) {
    ceilingTextureCtx.drawImage(img, 0, 0, 390, 714)
    instance.SetTexture(ws, ceiling, ceilingTextureCanvas)
  })
})
