const net = require('net');



module.exports.executeClient = function() {

    var client = new net.Socket();
    client.connect(6800, '127.0.0.1', function() {
        console.log('Connected'.green);
        client.write('Hello, server! Love, Client.');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });

    client.on('error', function(err) {
        console.log('[ERROR] : ' + err);
    });

};