// https://stackoverflow.com/questions/38124639/how-do-i-split-a-class-definition-across-multiple-files-in-node-js
/**
 * @author Taivas Gogoljuk
 *
 * @module Main
 */
"use strict";


const EventEmitter = require('events');

//Object.assign(AVROS.prototype, require("./core/CreateObject"))
var math3d = require("math3d")
global.Vector3 = math3d.Vector3;
global.Quaternion = math3d.Quaternion;
global.Transform = math3d.Transform;

global.isVoid = function isVoid(input) {
  if (typeof input == "undefined") {
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

    this.instanceSharing = false
    this.players = []
  }

  /**
   * Enables instance sharing
   */
  EnableMultiplayer() {
    this.instanceSharing = true
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
      self.InitSocket(socket)
      /**
       * Connected event.
       *
       * @event connected
       * @property {object}  - passes the connected socket
       */
      self.emit("connected", socket)



    })


    console.log("AVROS server listening on port " + port)
  }


  /**
   * Creates an object id
   * @method
   * @returns {Int} Returns the generated id
   */
  generateId() {
    var min = 1;
    var max = 100000;
    return Math.floor(Math.random() * (+max - +min)) + +min;
  }
}

Object.assign(AVROS.prototype, require("./core/CreateObject"))
Object.assign(AVROS.prototype, require("./core/ObjectManagement"))
Object.assign(AVROS.prototype, require("./core/SocketRationalization"))
Object.assign(AVROS.prototype, require("./core/AppInformation"))
Object.assign(AVROS.prototype, require("./core/SystemMessage"))







module.exports = AVROS
