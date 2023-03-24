var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//list of connected users
let connectedUserList = {};


app.use(express.static('public'));

//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {  
  
  client.emit("userList", Object.values(connectedUserList));
  
  client.on('message', (data) => {
    console.log("client.id", client.id);
    if(!connectedUserList[client.id]) {
      connectedUserList[client.id] = data.name;
      io.emit("newUser", { username : data.name })
    }
    
    console.log("Data", JSON.stringify(data));
    io.emit("newMessage", data)
  });

  client.on('typing', (data) => {
    client.emit('typing', data.username)
  })

  client.on('disconnecting', ()=>{
    console.log("Got Event disconnet", connectedUserList[client.id]);

    delete connectedUserList[client.id];
    io.emit("disconnected", Object.values(connectedUserList));

  });

});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});