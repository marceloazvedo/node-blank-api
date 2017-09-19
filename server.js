let http = require('http');
let app = require('./config/express');
require('./config/database')('mongodb://localhost/blank-project');

let port = process.env.PORT || 3000;

let server = http.createServer(app);

server.listen(port, function () {
	console.log('Server started!');
});