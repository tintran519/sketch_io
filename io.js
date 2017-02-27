//========================================
//Draw socket
var io = require('socket.io')();
var line_history = [];

// Listen for new connections here
io.on('connection', function(socket) {
  console.log('Client connected to socket.io!');

  // send history of lines to clients
  for (var i in line_history) {//check what does in do?
    socket.emit('draw_line', { line: line_history[i] } );
  }

  // add handler for message type "draw_line"
  socket.on('draw_line', function (data) {
    // add received line to history
    line_history.push(data.line);
    // send line to all clients
    io.emit('draw_line', {
      line: data.line,
      color: data.color,
      size: data.size,
      shape: data.shape,
      fill: data.fill,
      tool: data.tool
    });
  });

//==========================================
//Message socket
    socket.on('add-message', function (data) {
      io.emit('add-message', data);
    });

});

module.exports = io;
