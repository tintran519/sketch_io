console.log('JS loaded!');
document.addEventListener("DOMContentLoaded", function() {

var socket = io();
console.log(socket);

  //Mouse object to keep track of mouse status
var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  };

var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = width;
canvas.height = height;


//Mouse event handlers
canvas.onmousedown = function(e) {
  mouse.click = true;
}

canvas.onmouseup = function(e) {
  mouse.click = false;
}

canvas.onmousemove = function(e) {
  //normalize mouse position to range 0.0 - 1.0 to allow screen adaptiblity
  mouse.pos.x = e.clientX / width;
  mouse.pos.y = e.clientY / height;
  mouse.move = true;
};

//draw line client is listening for from server
socket.on('draw_line', function (data) {
  var line = data.line;
  context.beginPath();
  context.lineWidth = 1;
  context.moveTo(line[0].x * width, line[0].y * height);
  context.lineTo(line[1].x * width, line[1].y * height);
  context.stroke();
});

//main loop, running every 25ms
function mainLoop() {
  //checks if user is drawing
  if (mouse.click && mouse.move && mouse.pos_prev) {
    //send line to the server
    socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev] });
    mouse.move = false;
  }

  mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
  setTimeout(mainLoop, 25);
}

mainLoop();

});

//chatio

document.addEventListener("DOMContentLoaded", function() {
  var messages = document.getElementById('messages');
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');

  var socket = io();
  socket.on('add-message', function (data) {

    console.log('data',data)
    addMessage(data);
  });

  document.getElementById('btn-send-msg').addEventListener('click', function() {
    socket.emit('add-message', {
      name: userName.value,
      msg: newMsg.value
    });
    newMsg.value = '';
  });

  function addMessage(data) {
    messages.innerHTML += ['<li><strong>', data.name, ':</strong> ', data.msg + '</li>'].join('');
  }

});
