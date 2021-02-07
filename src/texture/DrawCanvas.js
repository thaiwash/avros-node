module.exports = {
  /**
   * Drawing tools.
   This function converts a canvas object to a unity plane texture

   * @method - SetTexture
   * @param {Int} textureId - an object id for a plane
   * @param {Object} canvas - this is a canvas object creeted by the node extension called canvas
   */
  "SetTexture": function(textureId, canvas) {
    this.io.sockets.emit("set texture", {
      "object_id": textureId + "",
      // the header needs to be stripped from this base64 encoded data string
      "texture": canvas.toDataURL().substr("data:image/png;base64,".length)
    })
  }
}