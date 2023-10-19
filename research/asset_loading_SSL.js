var https = require('https');
var fs = require('fs');
var https_options = {
	key: fs.readFileSync("/path/to/private.key"),
	cert: fs.readFileSync("/path/to/your_domain_name.crt"),
ca: [
	fs.readFileSync('path/to/CA_root.crt'),
	fs.readFileSync('path/to/ca_bundle_certificate.crt')
] };
https.createServer(options, function (req, res) {
	res.writeHead(200);
	res.end("Welcome to Node.js HTTPS Server");
}).listen(8443)