// https://stackoverflow.com/questions/38124639/how-do-i-split-a-class-definition-across-multiple-files-in-node-js
/**
 * @author Taivas Gogoljuk
 *
 * @module Main
 */
"use strict";

global.THREE = require('three');
global.AVROS = {}

//Object.assign(AVROS.prototype, require("./core/CreateObject"))
var math3d = require("math3d")
global.Vector3 = math3d.Vector3;
global.Quaternion = math3d.Quaternion;
global.Transform = math3d.Transform;

const {
  createCanvas,
  loadImage
} = require('canvas')

global.createCanvas = createCanvas
global.loadImage = loadImage

const EventEmitter = require('events');
global.fs = require('fs');

const { v4: uuidv4 } = require('uuid');

global.isVoid = function isVoid(input) {
  if (typeof input == "undefined") {
    return true
  }
  return false
}


global.Convert = {
  ThreeToAvros: {
    position: function(avrosJson, threeVector3) {
      avrosJson.posX = threeVector3.x + ""
      avrosJson.posY = threeVector3.y + ""
      avrosJson.posZ = threeVector3.z + ""

      return avrosJson
    },

    rotation: function(avrosJson, threeVector3) {

      threeVector3.z *= -1; // flip Z

      threeVector3.y -= (Math.PI); // Y is 180 degrees off

      var quat = new THREE.Quaternion();
      quat.setFromEuler(threeVector3);


      avrosJson.rotX = (-quat._x) + ""
      avrosJson.rotY = quat._y + ""
      avrosJson.rotZ = quat._z + ""
      avrosJson.rotW = (-quat._w) + ""
      return avrosJson
    },

    scale: function(avrosJson, threeVector3) {
      avrosJson.scaleX = threeVector3.x + ""
      avrosJson.scaleY = threeVector3.y + ""
      avrosJson.scaleZ = threeVector3.z + ""

      return avrosJson
    }
  },
  AvrosToThree: {

    position: function(avrosJson) {
      return new THREE.Vector3(
        parseFloat(avrosJson.posX),
        parseFloat(avrosJson.posY),
        parseFloat(avrosJson.posZ))
    },

    rotation: function(avrosJson) {

      var qx = parseFloat(avrosJson.rotX)
      var qy = parseFloat(avrosJson.rotY)
      var qz = parseFloat(avrosJson.rotZ)
      var qw = parseFloat(avrosJson.rotW)

      var q = new THREE.Quaternion(-qx, qy, qz, -qw)
      var v = new THREE.Euler()
      v.setFromQuaternion(q)

      v.y += (Math.PI) // Y is 180 degrees off


      v.z *= -1 // flip Z

      //this.camera.rotation.copy(v)
      return v
    },

    scale: function(avrosJson) {
      return new THREE.Vector3(
        parseFloat(avrosJson.scaleX),
        parseFloat(avrosJson.scaleY),
        parseFloat(avrosJson.scaleZ))
    }
  }
}


/**
 * Main class of the system, it works like an event emitter
 * @class Serve
 * @constructor {Number} port - The port number to use.
 */

class Serve extends EventEmitter {
  constructor(port) {
    super()
    var self = this
    
    this.ActivateInstanceIntegrityIntelligence()
    this.players = []
    this.instanceSharing = true

    var express = require('express');
    this.app = express()
    this.app.use(express.static(__dirname + '/public'))

    this.app.get('/players', function(req, res) {
      res.send(JSON.stringify(self.players, 0, 4));
      res.end();
    })

    this.server = require('http').createServer(this.app);
    var WebSocket = require('ws');
	
	this.wss = new WebSocket.Server({ port: port });

    /**
     * Socket Connection.
     *
     * @fires connected
     */
    this.wss.on('connection', function(ws) {
	  // Generate a unique ID for the connection
	  ws.connectionID = uuidv4()
  
      self.InitSocket(ws)
	  console.log("init socket")
      ws.send('HeadText|{"say": "Socket connection initialized."}');
      /**
       * Connected event.
       *
       * @event connected
       * @property {object}  - passes the connected socket
       */
		//ws.send('connected');
		console.log("client connected");


		ws.on('message', function(message) {
			console.log('Received message:' + message.toString());
			var msg = message.toString().split("|")
			self.emit(msg[0], msg[1]);
		});
		
		ws.on('close', () => {
			// Remove the connection from the connections map
			console.log(`Connection ${ws.connectionID} closed`);
		  });
    })


    console.log("AVROS sub application with address localhost:" + port)
  }


}


Object.assign(Serve.prototype, require("./ai/SocketSyncronization"))
Object.assign(Serve.prototype, require("./ai/InstanceRationalization"))
Object.assign(Serve.prototype, require("./core/ObjectManagement"))
Object.assign(Serve.prototype, require("./core/Creation"))
Object.assign(Serve.prototype, require("./core/ObjectTransform"))
Object.assign(Serve.prototype, require("./core/AppInformation"))
Object.assign(Serve.prototype, require("./core/SystemMessage"))
Object.assign(Serve.prototype, require("./database/JSONDatabase"))
Object.assign(Serve.prototype, require("./texture/DrawCanvas"))
Object.assign(Serve.prototype, require("./collider/BoxCollider"))
require("./thing/Thing")






global.AVROS.Serve = Serve
