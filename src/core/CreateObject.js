/**
 * @author Taivas Gogoljuk
 **/



  /**
   * Creates a new object
   * @constructor
   * @param {String} type - cube sphere or plane
   * @returns {Object} Returns the generated object
   */

 module.exports = {
   "CreatePrimitiveObject": function(type) {
     return {"obejct_id": generateId(), "type": type}
   },
   "SpawnAsset": function(type) {
     return {"obejct_id": generateId(), "type": type}
   }
 }


function generateId() {
  var min=1;
  var max=100000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
