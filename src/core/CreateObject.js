/**
 * @author Taivas Gogoljuk
 **/

module.exports = {
  /**
   * Creates a new object
   * @method
   * @param {String} type - cube sphere or plane
   * @returns {Object} Returns the generated object
   */
  "CreateObject": function(type) {
    return {
      "object_id": generateId(),
      "type": type
    }
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
  }
}


function generateId() {
  var min = 1;
  var max = 100000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}