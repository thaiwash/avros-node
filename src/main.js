/**
 * @author Taivas Gogoljuk
 *
 * @module Main
 */
"use strict";


global.THREE = require('three');
global.AVROS = {}

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

const {
    v4: uuidv4
} = require('uuid');

global.isVoid = function isVoid(input) {
    if (typeof input === "undefined") {
        return true
    }
    if (typeof input == null) {
        return true
    }
    return false
}



/**
 * Main class of the system, it works like an event emitter
 * @class Serve
 * @constructor {Number} port - The port number to use.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');


class Serve extends EventEmitter {
    constructor(port) {
        super()
        var self = this
        //this.setMaxListeners(1000);
				
		this.app = express()
		this.server = http.createServer(this.app)
		
		this.wss = new WebSocket.Server({
			server: this.server
		})
		
		
		

        this.logTraffic = true
        this.ConnectionsDebug = false

        this.server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

        this.InitDevtool = function(dtport, instance) {
            //this.devtoolApp = express()
            //var devtoolServer = require('http').createServer(this.devtoolApp);
            //this.dtwss = new WebSocket.Server({ devtoolServer });
            this.dti = new Serve(dtport)
            this.dti.AppInformation("Devtool " + port, "DevTool")
            this.dti.on("user enter", function(ws) {
                console.log("Devtool init")
                this.DevTool(ws, this)
            })


        }


        this.connections = [];



        this.listConnections = function() {
            if (this.ConnectionsDebug) {
                console.log('Time: ' + Date.now());
                console.log('There are '+this.connections.length+' open connections:');
            }
			
						
			for (var i = 0; i < this.connections.length; i ++) {
				if (this.ConnectionsDebug) {
					console.log(this.connections[i].connectionID);
					console.log("Ready state: " + this.connections[i].ws.readyState);
				}
				
				if (this.connections[i].ws.readyState == 1) {
                    this.connections[i].ws.send("SYNCRONIZATION_REQUEST")
				}
			}
			/*
			for (var i = 0; i < this.connections.length; i ++) {
                if (this.ConnectingDebug) {
                    console.log(`Connection ID: `+this.connections[i].connectionID);
                    console.log(ws.readyState)
                }
			}
            for (const [connectionId, ws] of connections) {
                if (ws.readyState == 1) {
                    //console.log("Sending "+"SYNCRONIZATION_REQUEST")
                }
            }*/
        }

        this.interval = setInterval(function() {
            self.listConnections();
        }, 1000);

        /**
         * Socket Connection.
         *
         * @fires connected
         */
        this.wss.on('connection', function(ws) {
            // Generate a unique ID for the connection
            ws.connectionID = uuidv4()

            // Store the WebSocket connection with its ID
            self.connections.push({
				"connectionID": ws.connectionID,
				"ws": ws
			})

            console.log("Init socket")
            self.InitSocket(ws)
            //ws.send('HeadText|{"say": "Socket connection initialized."}');
            /**
             * Connected event.
             *
             * @event connected
             * @property {object}  - passes the connected socket
             */
            //ws.send('connected');
            console.log("client connected")



            // Function to close a WebSocket connection by ID
            function closeConnectionById(connectionID) {
				
				for (var i = 0; i < self.connections.length; i ++) {
					if (self.connections[i].connectionID == connectionID) {
						self.connections[i].ws.terminate(); // Terminate the WebSocket 
						self.connections[i].ws.close(1005, 'disconnect');
						self.connections.splice(i, 1)
						return
					}
				}
				
            }

            ws.on('close', function() {
                // Remove the connection from the connections map
                console.log(`Connection ${ws.connectionID} closed\n\n`);
				
                closeConnectionById(ws.connectionID);
				
				
                self.listConnections();
                //clearInterval(self.syncTimer[ws.connectionID])
                //delete(self.syncTimer[ws.connectionID]);
            });

            ws.on('message', function(message) {
                var msg = message.toString().split("|")
                if (self.logTraffic) {
                    console.log('Received message:' + message.toString());
                }

                ws.emit(msg[0], ws, msg[1]);
            });
        })


        console.log("AVROS application with address localhost:" + port)
    }


}


Object.assign(Serve.prototype, require("./ai/SocketSyncronization"))
Object.assign(Serve.prototype, require("./ai/InstanceRationalization"))
Object.assign(Serve.prototype, require("./core/ObjectManagement"))
Object.assign(Serve.prototype, require("./core/Creation"))
Object.assign(Serve.prototype, require("./core/AppInformation"))
Object.assign(Serve.prototype, require("./core/SystemMessage"))
Object.assign(Serve.prototype, require("./database/JSONDatabase"))
Object.assign(Serve.prototype, require("./database/MYSQLDatabase"))
Object.assign(Serve.prototype, require("./texture/DrawCanvas"))
Object.assign(Serve.prototype, require("./collider/BoxCollider"))
Object.assign(Serve.prototype, require("./devtool/DevTool"))
require("./thing/Thing")




global.AVROS.Serve = Serve