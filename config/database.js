module.exports = function(uri) {

	var mongoose = require('mongoose');

	mongoose.connect(uri, { useMongoClient: true });

	mongoose.connection.on('connected', function() {
		console.log('MongoDB connected!');
	});

	mongoose.connection.on('error', function(error) {
		console.log('Connection error: ' + error);
	});	

	mongoose.connection.on('disconnected', function() {
		console.log('MongoDB disconnected')
	});

	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.log('App finished!!!');
			process.exit(0);
		});
		
	})
};
