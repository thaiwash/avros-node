/**
 * @author Taivas Gogoljuk
 **/
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  /**
   * Drawing tools.
   This function converts a canvas object to a unity plane texture

   * @method - SetTexture
   * @param {Int} textureId - an object id for a plane
   * @param {Object} canvas - this is a canvas object creeted by the node extension called canvas
   */
   
   "CachedImages": [],
   
  "SetTexture": function(ws, object, canvas, fileName) {
	  //console.log("set texture "+fileName)
	  if (isVoid(fileName)) {
		ws.send("set texture|"+JSON.stringify({
		  "object_id": object.object_id,
		  // the header needs to be stripped from this base64 encoded data string
		  "base64": canvas.toDataURL().substr("data:image/png;base64,".length)
		}))
	  } else {
		  if (isVoid(this.CachedImages[ws.connectionID])) {
			  this.CachedImages[ws.connectionID] = []
		  }
		  
		  
		  var found = false
		  //console.log(this.CachedImages[ws.connectionID].length)
		  for (var i = 0; i < this.CachedImages[ws.connectionID].length; i ++) {
				if (this.CachedImages[ws.connectionID][i].fileName == fileName) {
					ws.send("set texture|"+JSON.stringify({
					  "object_id": object.object_id,
					  "file_name": fileName,
					  "base64":""
					}))
					//console.log("texture cached")
					found = true
				}
		  }
		  if (!found) {
			  ws.send("set texture|"+JSON.stringify({
				  "object_id": object.object_id,
				  "file_name": fileName,
				  "base64": canvas.toDataURL().substr("data:image/png;base64,".length)
			  }))
			  
			  this.CachedImages[ws.connectionID].push({"fileName":fileName})
				//console.log("texture is now cached")
		  }
	  }
	  
  },
  
  "SetTextureBase64": function(ws, object, base64string) {
    ws.send("set texture|"+JSON.stringify({
      "object_id": object.object_id,
      // the header needs to be stripped from this base64 encoded data string
      "base64": base64string
    }))
  },
  
  "SetTextureFromImage": function(ws, thing, texture) {
	  var self = this
    loadImage(texture).then(function(img) {
		// Get the width and height of the loaded image
		const imageWidth = img.width;
		const imageHeight = img.height;

		var canvas = createCanvas(img.width, img.height);
		var ctx = canvas.getContext('2d');

		var textureCanvas = createCanvas(img.width, img.height);
		var  textureCtx = textureCanvas.getContext('2d');

		textureCtx.drawImage(img, 0, 0, img.width, img.height);
	  
		self.SetTexture(ws, thing, textureCanvas, texture)

    });
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