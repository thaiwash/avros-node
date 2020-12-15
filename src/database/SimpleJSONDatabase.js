module.exports = {
  /**
   * Activates a simple JSON databse

   Example: {
     "username": "solaris",
     "password": "s5RLSGfRPQ9zYmB",
     "address":"cluster0.ygien.mongodb.net",
     "dbname": "solarfactory"
   }


   * @method
   * @param {String} jsonFile - path to a json file to save to
   */
  "ActivateJSONdb": function(jsonFile) {
    const JSONdb = require('simple-json-db');
    this.db = new JSONdb(jsonFile);
  }
}