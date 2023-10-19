// https://stackoverflow.com/questions/38124639/how-do-i-split-a-class-definition-across-multiple-files-in-node-js
/**
 * @author Taivas Gogoljuk
 *
 * @module Main
 
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000; // The port on which the HTTP and WebSocket servers will listen

// Define a route for "/lobby" using Express
app.get('/lobby', (req, res) => {
  res.send('Welcome to the lobby!');
});

wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  // Handle WebSocket messages
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // You can send messages back to the client here, e.g., ws.send('Hello, client!').
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});
 
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

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

class Serve extends EventEmitter {
  constructor(port) {
    super()
    var self = this
    
	this.ConnectingDebug = true

    this.players = []
    this.instanceSharing = true

    var WebSocket = require('ws');
    var express = require('express');
    this.app = express()
    //this.app.use(express.static(__dirname + '/public'))
    var server = require('http').createServer(this.app);
	this.wss = new WebSocket.Server({ server });
		
	server.listen(port, () => {
	  console.log(`Server is running on http://localhost:${port}`);
	});

	
	const connections = new Map();

    this.app.get('/players', function(req, res) {
      res.send(JSON.stringify(self.players, 0, 4));
      res.end();
    })

	

	this.listConnections = function() {
		  if (this.ConnectingDebug) {
	  console.log('Time: '+Date.now());
	  console.log('List of open connections:');
		  }
	  for (const [connectionId, ws] of connections) {
		  if (this.ConnectingDebug) {
		console.log(`Connection ID: ${connectionId}`);
		console.log(ws.readyState)
		  }
		if (ws.readyState == 1) {
			ws.send("SYNCRONIZATION_REQUEST")
		}
	  }
	}
	
	this.interval = setInterval(function() {
		self.listConnections();
	}, 1000);
	
	this.InitEvents();
    /**
     * Socket Connection.
     *
     * @fires connected
     */
    this.wss.on('connection', function(ws) {
	  // Generate a unique ID for the connection
	  ws.connectionID = uuidv4()

	  // Store the WebSocket connection with its ID
	  connections.set(ws.connectionID, ws);
  
      self.InitSocket(ws)
	  console.log("Init socket")
      //ws.send('HeadText|{"say": "Socket connection initialized."}');
      /**
       * Connected event.
       *
       * @event connected
       * @property {object}  - passes the connected socket
       */
		//ws.send('connected');
		console.log("client connected");


		
				// Function to close a WebSocket connection by ID
		function closeConnectionById(connectionId) {
		  const ws = connections.get(connectionId);
		  if (ws) {
			//ws.terminate(); // Terminate the WebSocket 
			ws.close(1005, 'disconnect'); 
			console.log("connection closed")
		  }
		}

		ws.on('close', function() {
			// Remove the connection from the connections map
			console.log(`Connection ${ws.connectionID} closed`);
			closeConnectionById(ws.connectionId);
			connections.delete(ws.connectionId);
			self.listConnections();
			//clearInterval(self.syncTimer[ws.connectionID])
			delete(self.syncTimer[ws.connectionID]);
		});
			
		ws.on('message', function(message) {
			console.log('Received message:' + message.toString());
			var msg = message.toString().split("|")
			self.emit(msg[0], ws, msg[1]);
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
Object.assign(Serve.prototype, require("./database/MYSQLDatabase"))
Object.assign(Serve.prototype, require("./texture/DrawCanvas"))
Object.assign(Serve.prototype, require("./collider/BoxCollider"))
require("./thing/Thing")






global.AVROS.Serve = Serve
