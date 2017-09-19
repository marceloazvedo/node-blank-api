let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');

let app = express();

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('secret', 'yoursecret'); 

consign({cwd: 'app'})
	.include('models')
	.then('api')
	.then('routes/interceptor.js')
	.then('routes')
	.into(app);

module.exports = app;