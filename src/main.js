// https://stackoverflow.com/questions/38124639/how-do-i-split-a-class-definition-across-multiple-files-in-node-js
/**
 * @author Taivas Gogoljuk
 *
 * @module Main
 */

const EventEmitter = require('events');

function isVoid(variable) {
	if (typeof variable === "undefined") {
        return true
	}
    return false
}


/**
* Main class of the system, it works like an event emitter
* @class AVROS
*/

class AVROS extends EventEmitter {
  constructor() {
    super()

    this.players = []
  }

    /**
     * Opens a socket port for an AVROS application
     * @param {Number} port - The port number to use.
     */
  Serve(port) {
    var self = this

    var express = require('express');
  	this.app = express()
    this.app.use(express.static(__dirname + '/public'))

    this.app.get('/players', function(req, res) {
  		res.send(JSON.stringify(self.players, 0, 4));
  		res.end();
  	})

  	this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);

		this.server.listen(port);

    /**
    * Socket Connection.
    *
    * @fires connected
    */
		this.io.on('connection', function(socket) {
			self.initSocket(socket)
      /**
     * Connected event.
     *
     * @event connected
     * @property {object}  - passes the connected socket
     */
      self.emit("connected", socket)
		})


		console.log("Server: AVROS server listening on port "+ port)
  }
}

Object.assign(AVROS.prototype, require("./core/CreateObject"))
Object.assign(AVROS.prototype, require("./core/SocketRationalization"))


module.exports = AVROS