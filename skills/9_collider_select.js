var AVROS = require("../src/main.js")
var instance = new AVROS()
instance.Serve(9447)
instance.AppInformation("Tester")

// Example cube
global.cube = {
  "id": instance.GenerateId(),
  "type": "empty",
  "children": [{
    "type": "cube",
    "scale": {
      "x": "0.1",
      "y": "0.1",
      "z": "0.1"
    }
  }]
}

global.helperSphere = {
  "id": instance.GenerateId(),
  "type": "sphere",
  "scale": {
    "x": "0.01",
    "y": "0.01",
    "z": "0.01"
  }
}


// todo: upgrade to recursive refinement with transforms
instance.Refine = function(obj) {
    var ret = {}

    ret.id = parseInt(obj.object_id)
    ret.type = obj.type

    if(!isVoid(obj.parent)) {
      ret.parent = parseInt(obj.parent)
    }

    ret.position = new Vector3(
      parseFloat(obj.posX),
      parseFloat(obj.posY),
      parseFloat(obj.posZ)
    )
    ret.rotation = new Quaternion(
      parseFloat(obj.rotX),
      parseFloat(obj.rotY),
      parseFloat(obj.rotZ),
      parseFloat(obj.rotW)
    )
    return ret
}


instance.GetTopmostParent = function(obj) {
    while(!isVoid(obj.parent)) {
      obj = instance.GetObjectById(obj.parent)
    }
    return obj
}

instance.CollisionCheck = function(cube, point, scale) {

  var t1 = new Transform(
    global.cube.position,
    global.cube.rotation
  )
  var t2 = new Transform(
    instance.players[player].rightController.position,
    Quaternion.zero
  )

  t1.addChild(t2)
  t1.rotation = Quaternion.Euler(0,0,0)

  if (t1.position.x+0.05 > t2.position.x
  && t1.position.x-0.05 < t2.position.x
  && t1.position.y+0.05 > t2.position.y
  && t1.position.y-0.05 < t2.position.y
  && t1.position.z+0.05 > t2.position.z
  && t1.position.z-0.05 < t2.position.z) {

          console.log("true")
  }else {
        console.log("false")
  }
}


instance.on("player enter", function(player) {
console.log("Player " + player + " entered")
  instance.SpawnAsInterest(player, global.cube)
  return;

  //global.cube.children.push(global.cube)


  //global.helperSphere.parent = global.cube.id



  //instance.DescribeObject(global.helperSphere, player)

    setTimeout(function() {
        global.obj = instance.GetObjectById(global.cube.id)

                global.obj = instance.Refine(global.obj)
                  global.t1 = new Transform(
                    global.cube.position,
                    global.cube.rotation
                  )
                  global.t2 = new Transform(
                    instance.players[player].rightController.position,
                    instance.players[player].rightController.rotation
                  )
          //global.t1.addChild(global.t2)


                  global.helperSphere.position = {
                        "x": global.t2.position.x,
                        "y": global.t2.position.y,
                        "z": global.t2.position.z
                  }

              console.log(global.helperSphere.position)
              console.log(global.t2.localPosition)
        //obj.rotation = Quaternion.Euler(0,0,0)
        instance.DescribeObject(global.helperSphere, player)
    }, 3000)
      setTimeout(function() {

                global.t1.addChild(global.t2)
        //var sav = global.t1.inverseTransformPosition(global.t2.position)

                console.log("inverse")
                        //console.log(sav)
                            console.log(global.t1.rotation)
        global.t1.rotation = Quaternion.Euler(0,0,0)
        //global.t1.rotate(90,0,0)
        //global.t2.position = global.t1.transformPosition(sav)
              //  console.log(global.t2.position)

                console.log("this")
        console.log(global.t1.rotation)

                global.helperSphere.position = {
                      "x": global.t2.position.x,
                      "y": global.t2.position.y,
                      "z": global.t2.position.z
                }
global.cube.rotation = {
  "x": global.t1.rotation.x,
  "y": global.t1.rotation.y,
  "z": global.t1.rotation.z
}

                console.log(global.helperSphere.position)
                console.log(global.t2.position)
          //obj.rotation = Quaternion.Euler(0,0,0)
          instance.DescribeObject(global.cube, player)
          instance.DescribeObject(global.helperSphere, player)
      }, 6000)
})
//success

instance.on("player update", function(player) {
    //global.obj = instance.GetObjectById(global.cube.id)

    //global.obj = instance.Refine(global.obj)
})
