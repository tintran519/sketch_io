//io.js

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
    io.emit('draw_line', { line: data.line, color: data.color} );
  });






    socket.on('add-message', function (data) {
      // console.log('datauhiuhiuh', data),
      io.emit('add-message', data);

      // io.emit('add-message','hello world');
    });

});

//=====================
// var sDrawData = {
//   x: [],
//   y: [],
//   drag: [],
//   userDraw:'',
//   color: [],
//   shape: [],
//   fill: [],
//   size: []
// };

// io.on('connection', function(socket) {
//   console.log('Client connected to socket.io!');
//   socket.on('end-line', function(data) {
//     sDrawData.userDraw = data.userDraw;

//     console.log(data.userDraw);
//     io.emit('end_line', {userDraw: sDrawData.userDraw})
//   })

//   socket.on('drawn_line', function(drawData) {
//     sDrawData.userDraw = drawData.userDraw;
//     if(sDrawData.userDraw) {
//     sDrawData.x.push(...drawData.x);
//     sDrawData.y.push(...drawData.y);
//     sDrawData.drag.push(...drawData.drag);
//     sDrawData.color.push(...drawData.color);
//     sDrawData.shape.push(...drawData.shape);
//     sDrawData.fill.push(...drawData.fill);
//     sDrawData.size.push(...drawData.size);

//     console.log('this is what server sending', sDrawData);
//     io.emit('receive', sDrawData);
//   }
//   })


// });






// io represents socket.io on the server
module.exports = io;
