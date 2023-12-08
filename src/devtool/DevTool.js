const DevTool = require('./DevToolClass.js');

module.exports = {

  "DevTool": function(ws, inst) {
	  
	  return new DevTool(inst, ws)
  }
}
