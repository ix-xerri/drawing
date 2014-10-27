var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

http.listen(app.get('port'), function() {
    console.log('open localhost:'+app.get('port'));
});

io.on('connection', function(socket){
    socket.on('draw', function(params) {
        io.emit('draw',params);
    });
});