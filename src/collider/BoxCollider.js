/**
 * @author Taivas Gogoljuk



Todo:


instance.GetTopmostParent = function(obj) {
  while (!isVoid(obj.parent)) {
    obj = instance.GetObjectById(obj.parent)
  }
  return obj
}

sum up all scales and rotations and positions so that
this function works with children of children


 **/

module.exports = {
  /**
     * Spawns object in front of connected players

     * @method
     * @param {Object} point - object tier2
     * @param {Object} cube - object tier2
     * @param {Object} offset - (optional) object tier1
  */
  "IsWithinCube": function(point, cube, hinge) {

    if (isVoid(hinge)) {
      hinge = {
        scale: new Vector3(1, 1, 1),
        position: new Vector3(0, 0, 0),
        roration: new Quaternion()
      }
    }

    var t1 = new Transform(
      hinge.position,
      hinge.rotation
    )
    var t2 = new Transform(
      point.position,
      Quaternion.zero
    )

    t1.addChild(t2)
    t1.rotation = Quaternion.Euler(0, 0, 0)

    var pos = {
      "x": t1.position.x + (cube.position.x * hinge.scale.x),
      "y": t1.position.y + (cube.position.y * hinge.scale.y),
      "z": t1.position.z + (cube.position.z * hinge.scale.z)
    }

    var scale = {
      "x": (cube.scale.x / 2) * hinge.scale.x,
      "y": (cube.scale.y / 2) * hinge.scale.y,
      "z": (cube.scale.z / 2) * hinge.scale.z
    }

    if (pos.x + scale.x > t2.position.x &&
      pos.x - scale.x < t2.position.x &&
      pos.y + scale.y > t2.position.y &&
      pos.y - scale.y < t2.position.y &&
      pos.z + scale.z > t2.position.z &&
      pos.z - scale.z < t2.position.z) {
      return true
    } else {
      return false
    }
  },



  // Multi level inherited collision detection
  "IsWithinCube2": function(point, cube /* hinge1, hinge2 */ ) {
    // get all parents
    // construct 1 tier2 solid object
    // get real matrix positions


    function ParentTransform(obj) {
      var objs = this.AllObjects()
      for (var i = 0; i < objs.length; i++) {
        objs[i].parent == c
      }
    }

    var obj = this.GetObjectById(cube.id)
    while (obj.parent) {
      obj = this.GetObjectById(obj.parent)
    }

    var t1 = new Transform(
      hinge.position,
      hinge.rotation
    )
    var t2 = new Transform(
      point.position,
      Quaternion.zero
    )

    t1.addChild(t2)
    t1.rotation = Quaternion.Euler(0, 0, 0)

    var pos = {
      "x": t1.position.x + (cube.position.x * hinge.scale.x),
      "y": t1.position.y + (cube.position.y * hinge.scale.y),
      "z": t1.position.z + (cube.position.z * hinge.scale.z)
    }

    var scale = {
      "x": (cube.scale.x / 2) * hinge.scale.x,
      "y": (cube.scale.y / 2) * hinge.scale.y,
      "z": (cube.scale.z / 2) * hinge.scale.z
    }

    if (pos.x + scale.x > t2.position.x &&
      pos.x - scale.x < t2.position.x &&
      pos.y + scale.y > t2.position.y &&
      pos.y - scale.y < t2.position.y &&
      pos.z + scale.z > t2.position.z &&
      pos.z - scale.z < t2.position.z) {
      return true
    } else {
      return false
    }
  },

  "IsWithinThreeCube": function(point, cube) {
    var bb = new THREE.Box3(); // for re-use
    bb.setFromObject(cube);
    bb.containsPoint(pointA)
    //console.log(bb);
    //console.log(, bb.containsPoint(pointB));

    new THREE.BoxGeometry(1, 1, 1);
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffff00,
      wireframe: true
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = p.x;
    cube.position.y = p.y;
    cube.position.z = p.z;
    scene.add(cube);
  }
}