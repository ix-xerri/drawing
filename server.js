var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//saving the image in memory to update new clients
var drawing = {
    clickX: [],
    clickY: [],
    clickDrag: []
};

var users = {}

var resetDrawing = function(){
    drawing = {
        clickX: [],
        clickY: [],
        clickDrag: []
    }
}

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

http.listen(app.get('port'), function() {
    console.log('open localhost:'+app.get('port'));
});

io.on('connection', function(socket){
    //log new user
    var address = socket.handshake.address,
        userAgent = socket.handshake.headers['user-agent'];
    
    console.log("New connection from " + address + " - " + userAgent);
    
    //save new user to list
    users[socket.id] = {
        address: address,
        userAgent: userAgent
    }
    
    //send new user list
    io.emit('users', users);
    
    //emit entire drawing
    io.emit('draw', drawing);
    
    socket.on('draw', function(params) {
        //save the entire drawing
        drawing = params;
        
        //emit the entire drawing
        io.emit('draw',params);
    });
    
    socket.on('disconnect', function() { 
        console.log(socket.id + ' disconnected');
        //delete from the user store
        delete users[socket.id];
                
        //if everyone left the drawing reset it
        if(Object.keys(users).length === 0){
            resetDrawing();
        }
        
        //send new user list
        io.emit('users', users);
    });
});