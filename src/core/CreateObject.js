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
    var obj = this.Construct(object)

    obj.posX = this.players[player].rightController.position.x
    obj.posY = this.players[player].rightController.position.y
    obj.posZ = this.players[player].rightController.position.z

    this.UpdateObject(obj)
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
   * Constructs an object definitio
   * @method
   * @param {Object} params - description object

   * @object
   * @param {Object} params - description object
  */
  "Construct": function(object) {

    var _obj = {}
    if (!isVoid(object.id)) {
      _obj.object_id = parseInt(object.id) + ""
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


    return _obj
  }
}


function generateId() {
  var min = 1;
  var max = 100000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}