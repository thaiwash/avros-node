/**
 * @author Taivas Gogoljuk
 **/



  /**
   * Opens a socket port for an AVROS application
   * @constructor
   * @param {Number} port - The port number to serve.
   * @returns {Object} Returns the instance object for AVROS.
   */

 module.exports = function Serve(port) {
   this.app = express()

   this.app.use(express.static(__dirname + '/public'))

   this.app.get('/players', function(req, res) {
     res.send(JSON.stringify(self.players, 0, 4));
     res.end();
   })
   this.server = require('http').createServer(this.app);

   this.io = require('socket.io')(server);

   this.server.listen(port);

   this.io.on('connection', function(socket) {
     self.systemMessage("server: connection detected")
     self.initSocket(socket)
   })
 }
