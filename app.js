const express = require('express');
const colors = require('colors');
const path = require('path');
const bodyParser = require('body-parser'); //parsing incoming request
const cors = require('cors');
const passport = require('passport');
const server_response = require('./response/serverResponse');

var app = express();

//PORT
const port = process.env.PORT || 5000;

// Cross Origin Resource Sharing Middleware
app.use(cors());

//set Static Folder (Public)

app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware

app.use(bodyParser.json());

const api = require('./routes/api');


//api endpoints
app.use('/api', api);

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.send('Wrong Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {

  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('joinRoom', function (room) {
    console.log("Joining Room", room);
    socket.join(room);
  });

  socket.on('comment', function (d) {
    var data = d.data;
    console.log(data);
    socket.broadcast.to(data.room).emit('rtComment', data);
  });

  socket.on('foo', function (d) {
    var data = d.data;
    console.log(data);
  });


});

http.listen(port, function () {
  server_response.startServer(port);
  require('./businesslogics/aerolinkserver').establishedLogDBServer();
});

http.on('close', function () {
  server_response.closeServer();
})

http.on('error', function (err) {
  server_response.errorServer(err);
})