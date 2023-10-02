module.exports = {
  "Transform": function(obj, transform_time, start_time) {
    var obj = this.ConvertToTier0(obj)

    if (isVoid(transform_time)) {
      obj.transform_time = 2000 + ""
    } else {
      obj.transform_time = transform_time + ""
    }
    if (isVoid(start_time)) {
      start_time = Date.now() + "";
    } else {
      start_time = start_time + "";
    }

    this.I.io.sockets.emit("object transform", obj)
  }
}