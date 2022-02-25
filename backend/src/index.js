const server = require('./app');
const http = require('http').Server(server);
const config = require('./config');

http.listen(config.serverPort,  function(req, res) {
    console.log('Server is listening on port', config.serverPort);
});
