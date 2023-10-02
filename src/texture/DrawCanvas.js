module.exports = {
  /**
   * Drawing tools.
   This function converts a canvas object to a unity plane texture

   * @method - SetTexture
   * @param {Int} textureId - an object id for a plane
   * @param {Object} canvas - this is a canvas object creeted by the node extension called canvas
   */
  "SetTexture": function(ws, object, canvas) {
    ws.send("set texture|"+JSON.stringify({
      "object_id": object.object_id,
      // the header needs to be stripped from this base64 encoded data string
      "base64": canvas.toDataURL().substr("data:image/png;base64,".length)
    }))
  },


  "SetColor": function(id, color) {
    var canvas = createCanvas(1, 1)
    var ctx = canvas.getContext('2d')

    if (isVoid(color)) {
      ctx.fillStyle = "#000000"
    } else {
      ctx.fillStyle = color
    }
    ctx.fillRect(0, 0, 1, 1)
    this.SetTexture(id, canvas)
  }
}