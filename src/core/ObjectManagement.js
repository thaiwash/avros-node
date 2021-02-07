/**
 * @author Taivas Gogoljuk
 **/
module.exports = {

  /**
   * Bookkeeping
   * @method
   * @param {String} player - Player's name.
   * @param {Object} data - Object to update
   */
  "UpdatePlayerObjectLedger": function(player, data) {

    // Update player spesific object ledger
    var objs = this.players[player].objects
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].object_id == data.object_id) {
        objs[i] = data
        return
      }
    }
    this.players[player].objects.push(data)
  },

  /**
   * Called whenever player changes anything
   * @method
   * @param {Object} data - Object to update
   * @param {String} player - Updated player's name. Required if instance sharing is disabled
   */

  "ObjectUpdateEvent": function(data, player) {
    this.emit("object changed", data)
    if (this.instanceSharing) {
      this.players[player].socket.broadcast.emit("object changed", data)
    }
    this.systemMessage("" + player + " changed object " + data.name + " " + data.object_id, "NOTICE")
  },


  /**
   * Get all objects within the instance
   * @method
   * @return {Array} data - all objects
   */
  "AllObjects": function() {
    var objs = []
    var playerNames = Object.keys(this.players)
    for (var i = 0; i < playerNames.length; i++) {
      if (isVoid(this.players[playerNames[i]].objects)) {
        this.players[playerNames[i]].objects = []
      }
      for (var i2 = 0; i2 < this.players[playerNames[i]].objects.length; i2++) {
        objs.push(this.players[playerNames[i]].objects[i2])
      }
    }
    return objs
  },
  /**
   * Add tag to object to change its behavior

   Available tags:

   - Grabable - Makes object grabbable by the human
   - Scalable - Enables object scaling (needs grabable flag to work)
   - GrabMyParent - This is for grabbable child objects [todo: refacture out]

   * @method
   * @param {Int} object_id - Object id
   * @param {String} tag - Tag to add
   */

  "AddTag": function(object_id, tag) {
    this.io.sockets.emit("add tag", {
      "object_id": object_id + "",
      "tag": tag
    })
  },
  /**
   * Remove tag to object

   * @method
   * @param {Int} object_id - Object id
   * @param {String} tag - Tag to remove
   */

  "RemoveTag": function(object_id, tag) {
    this.io.sockets.emit("remove tag", {
      "object_id": object_id + "",
      "tag": tag
    })
  },


  /**
   * Creates an object id
   * @method
   * @returns {Int} Returns the generated id
   */
  "GenerateId": function() {
    var min = 1
    var max = 100000
    return (Math.floor(Math.random() * (+max - +min)) + min);
  }
}