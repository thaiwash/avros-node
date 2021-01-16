/**
 * @author Taivas Gogoljuk

Object description can have
 - "type" = "cube" | "sphere" | "plane" | "empty"
 - "id" = number
 **/

module.exports = {
  /**
    * Spawns object in front of connected players

    * @method
    * @param {String} player - player name
    * @param {Object} params - description object
 */
  "SpawnAsInterest": function(player, object) {
    var t1 = new Transform(this.players[player].head.position, this.players[player].head.rotation);
    var vec = t1.transformPosition(new Vector3(0, 0, 0.5))

    object.position = vec
    object.rotation = this.players[player].head.rotation

    this.DescribeObject(object, player)
  },

  /**
     * Spawns in object

     * @object
     * @param {Object} params - description object
  */
  "Spawn": function(object) {
    this.UpdateObject(this.Construct(object))
  },

  /**
   * Spawns a prefabricated asset made with unity
   * @method
   * @param {String} asset - path to asset
   * @returns {Object} Returns the generated object
   */
  "SpawnAsset": function(type) {
    return {
      "object_id": generateId(),
      "type": type
    }
  },

    /**
     * Constructs an object definition
     * @method
     * @param {Object} params - description object

     * @object
     * @param {Object} params - description object
    */
    "Construct": function(object) {
      var _obj = {}
      if (!isVoid(object.id)) {
        _obj.object_id = parseInt(object.id) + ""
      } else {
        _obj.object_id = generateId()
      }


      if (!isVoid(object.object_id)) {
        _obj.object_id = parseInt(object.object_id) + ""
      }

      if (isVoid(_obj.object_id)) {
        _obj.object_id = generateId()
      }

      if (_obj.object_id.length == 0) {
        console.warn("Refacturing ID complications")
        _obj.object_id = generateId()
      }


      if (isVoid(object.type)) {
        _obj.type = "empty"
      } else {
        _obj.type = object.type
      }

      if (isVoid(object.name)) {
        _obj.name = ""
      } else {
        _obj.type = object.name
      }

      if (!isVoid(object.scale)) {
        _obj.scaleX = object.scale.x + ""
        _obj.scaleY = object.scale.y + ""
        _obj.scaleZ = object.scale.z + ""
      } else {
        if (isVoid(object.scaleX)) {
          _obj.scaleX = "1"
        } else {
          _obj.scaleX = object.scaleX
        }
        if (isVoid(object.scaleY)) {
          _obj.scaleY = "1"
        } else {
          _obj.scaleY = object.scaleY
        }
        if (isVoid(object.scaleZ)) {
          _obj.scaleZ = "1"
        } else {
          _obj.scaleZ = object.scaleZ
        }
      }

      if (!isVoid(object.position)) {
        _obj.posX = object.position.x + ""
        _obj.posY = object.position.y + ""
        _obj.posZ = object.position.z + ""
      } else {
        if (isVoid(object.posX)) {
          _obj.posX = "0"
        } else {
          _obj.posX = object.posX + ""
        }
        if (isVoid(object.posY)) {
          _obj.posY = "0"
        } else {
          _obj.posY = object.posY + ""
        }
        if (isVoid(object.posZ)) {
          _obj.posZ = "0"
        } else {
          _obj.posZ = object.posZ + ""
        }
      }

      if (!isVoid(object.rotation)) {
        _obj.rotX = object.rotation.x + ""
        _obj.rotY = object.rotation.y + ""
        _obj.rotZ = object.rotation.z + ""
        _obj.rotW = object.rotation.w + ""
      } else {
        if (isVoid(object.rotX)) {
          _obj.rotX = "0"
        } else {
          _obj.rotX = object.rotX + ""
        }
        if (isVoid(object.rotY)) {
          _obj.rotY = "0"
        } else {
          _obj.rotY = object.rotY + ""
        }
        if (isVoid(object.rotZ)) {
          _obj.rotZ = "0"
        } else {
          _obj.rotZ = object.rotZ + ""
        }
        if (isVoid(object.rotW)) {
          _obj.rotW = "0"
        } else {
          _obj.rotW = object.rotW + ""
        }
      }

      if (!isVoid(object.parent)) {
        _obj.parent = object.parent + ""
      }

      return _obj
    },

    "RecursiveContruct": function(object) {
      var _obj = this.Contruct(object)
        var objects = [_obj]
        if (!isVoid(object.children)) {
          for (var i = 0; i < object.children.length; i++) {
            object.children[i].parent = _obj.object_id
            objects.concat(this.RecursiveContruct(object.children[i]))
          }
        }

        return objects
    }
}



function generateId() {
  var min = 1;
  var max = 100000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
