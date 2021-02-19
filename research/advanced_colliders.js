var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

console.log("Move your controller inside the cube")

// Example cube
var cube = {
  "id": 72763,
  "type": "empty",
  "children": [{
    "id": 72768,
    "type": "cube",
    "scale": {
      "x": "0.1",
      "y": "0.1",
      "z": "0.1"
    }
  }]
}





instance.on("player enter", function(player) {
  console.log("Player " + player + " entered")
  instance.SpawnAsInterest(player, cube)
  instance.GetPlayerSocket(player).emit("head text", {
    "text": "Move your controller near the cube"
  })
})

var colored = true
instance.on("player update", function(player) {

  if (isVoid(instance.GetObjectById(cube.id))) {
    console.log("not found")
    return
  }
  //console.log(instance.GetObjectById(cube.id))
  //console.log(instance.GetObjectById(cube.children[0].id))
  var obj = instance.Tier0ToTier2(instance.GetObjectById(cube.id))
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

function Intersection(point, cube) {
  var box = new THREE.Object3D()
  box.position = new THREE.Vector3(
    cube.position.x,
    cube.position.y,
    cube.position.z
  )

  box.scale = new THREE.Vector3(
    cube.scale.x,
    cube.scale.y,
    cube.scale.z
  )
  box.rotation = new THREE.Quaternion(
    cube.rotation.x,
    cube.rotation.y,
    cube.rotation.z,
    cube.rotation.x
  )
  var sphere = new THREE.Sphere(
    new THREE.Vector3(
      point.x,
      point.y,
      point.z
    ),
    0.2
  )

  var b = new THREE.Box3()
  b.setFromObject(box)
  return b.intersectsSphere(sphere)
}
