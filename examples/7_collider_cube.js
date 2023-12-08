/*
This feature is depricated, since it requires controller tracking (witch can be a security issue)
*/


require("../src/main.js")
var instance = new AVROS.Serve(80)
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

console.log("Move your controller inside the cube")



instance.on("player enter", function(ws) {
    console.log("Player " + ws.userName + " entered")
    instance.SpawnAsInterest(ws, cube)
    ws.send('HeadText|{"say": "Move your controller inside the cube"}');
})

var colored = true
instance.on("player update", function(ws) {
  console.log("player update called")
  
  ws.send('HeadText|{"say": "Player update called"}');
  
  if (isVoid(instance.GetObjectById(cube.id))) {
	  
    console.log("not found")
	
    return
  }
  
  console.log(instance.GetObjectById(cube.id))
  
  console.log(instance.GetObjectById(cube.children[0].id))
  
  var obj = instance.RawToT(instance.GetObjectById(cube.id))
  
  var obj2 = instance.Tier0ToTier2(instance.GetObjectById(cube.children[0].id))
  
  //console.log(obj)
  //console.log(obj2)

  //  console.log(instance.IsWithinCube(instance.players[player].rightController, obj2, obj))
  if (instance.IsWithinCube(instance.players[player].rightController, obj2, obj)) {
    if (!colored) {
      colored = true
      instance.SetColor(cube.children[0].id, "#0000ff")
    }
  } else {
    if (colored) {
      colored = false
      instance.SetColor(cube.children[0].id, "#ffffff")
    }
  }
})
