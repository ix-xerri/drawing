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

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

http.listen(app.get('port'), function() {
    console.log('open localhost:'+app.get('port'));
});

io.on('connection', function(socket){
    io.emit('draw', drawing);
    
    socket.on('draw', function(params) {
        //save the entire drawing
        drawing = params;
        
        //emit the entire drawing
        io.emit('draw',params);
    });
});