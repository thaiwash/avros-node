/**
Tier translations translate objects between tiers,
Tier0 is raw data, or the type of data that gets communicated through the socket
Its always string format JSON object
Tier1 is Human readable JSON, it's optimized for manual configuration.
Tier2 is Math3d library converted, and can be used for further calculations
 */

 module.exports = {
   "Tier2ToTier3": function(obj) {


      function ConvertRotation(qx, qy, qz, qw) {

        var q = new THREE.Quaternion(-qx, qy, qz, -qw)
        var v = new THREE.Euler()
        v.setFromQuaternion(q)

        v.y += (Math.PI) // Y is 180 degrees off


        v.z *= -1 // flip Z

        return v
      }

      var scale = new THREE.Vector3()

      if (!isVoid(obj.scale)) {
        scale = new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z)
      }
 
     // type = empty
     var object = new THREE.Object3D()
 
     if (!isVoid(obj.type)) {
       if (obj.type == "cube") {
         object = new THREE.BoxGeometry( scale.x, scale.y, scale.z )
       }
       if (obj.type == "sphere") {
         object = new THREE.SphereGeometry( scale.x, scale.y, scale.z )
       }
       if (obj.type == "plane") {
        object = new THREE.PlaneGeometry( scale.x, scale.y, scale.z )
       }
     }


     if (!isVoid(obj.position)) {
      object.position = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)
    }

    if (!isVoid(obj.rotation)) {
      object.rotation = ConvertRotation(obj.rotation.x, obj.rotation.y, obj.rotation.z, obj.rotation.w)
    }

    if (!isVoid(obj.id)) {
      //is this doable?
      object.object_id = obj.id
    }

    if (!isVoid(obj.parent)) {
      object.parent = obj.parent
    }

    if (!isVoid(obj.name)) {
      object.name = obj.name
    }

     return object
   },

   "Tier2ToTier0": function(object) {


    },
    "Tier2ToTier1": function(obj) {
      return this.Tier0ToTier1(this.Tier2ToTier0(obj))
    },
    
}
