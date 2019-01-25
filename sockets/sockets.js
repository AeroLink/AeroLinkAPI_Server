
const response = require('../response/serverResponse');

module.exports = function (io) {

    //Applicants Sockets
    var app_socks = io.of('/applicants');
    app_socks.on('connection', function(socket) {
        response.socketSuccess('A user was connected to [/applicants] route');
        
        //Room Name : APP_ + applicantID -> example APP_1
        socket.on('join_room', function(room) {
            response.socketNormal('Joining to ROOM : ' + room);
            socket.join(room);
        });

        socket.on('notify', function(c){
            var clientdata = JSON.parse(c);
            var data = clientdata.data;
            response.socketNormal('Notification : ' + data);
            socket.broadcast.to(clientdata.room).emit('receive_notif', data);
        });

        socket.on('message', function(c){
            var clientdata = JSON.parse(c);
            var data = clientdata.data;
            response.socketNormal('Message to Client : ' + data);
            socket.broadcast.to(clientdata.room).emit('receive_message', data);
        });

    });

    // io.on('connection', function (socket) {
    
    //     console.log('a user connected');
      
    //     socket.on('disconnect', function () {
    //       console.log('user disconnected');
    //     });
      
    //     socket.on('joinRoom', function (room) {
    //       console.log("Joining Room", room);
    //       socket.join(room);
    //     });
      
    //     socket.on('comment', function (d) {
    //       var data = d.data;
    //       console.log(data);
    //       socket.broadcast.to(data.room).emit('rtComment', data);
    //     });
      
    //     socket.on('foo', function (d) {
    //       var data = d.data;
    //       console.log(data);
    //     });

    //   });

};