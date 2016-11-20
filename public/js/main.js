// console.log('JS loaded!');
// document.addEventListener("DOMContentLoaded", function() {

// var socket = io();
// console.log(socket);

//   //Mouse object to keep track of mouse status
// var mouse = {
//     click: false,
//     move: false,
//     pos: {x:0, y:0},
//     pos_prev: false
//   };

// var canvas = document.getElementById('board');
// var context = canvas.getContext('2d');
// var width = window.innerWidth;
// var height = window.innerHeight;

// canvas.width = width;
// canvas.height = height;


// //Mouse event handlers
// canvas.onmousedown = function(e) {
//   mouse.click = true;
// }

// canvas.onmouseup = function(e) {
//   mouse.click = false;
// }

// canvas.onmousemove = function(e) {
//   //normalize mouse position to range 0.0 - 1.0 to allow screen adaptiblity
//   mouse.pos.x = e.clientX / width;
//   mouse.pos.y = e.clientY / height;
//   mouse.move = true;
// };

// //draw line client is listening for from server
// socket.on('draw_line', function (data) {
//   var line = data.line;
//   context.beginPath();
//   context.lineWidth = 1;
//   context.moveTo(line[0].x * width, line[0].y * height);
//   context.lineTo(line[1].x * width, line[1].y * height);
//   context.stroke();
// });

// //main loop, running every 25ms
// function mainLoop() {
//   //checks if user is drawing
//   if (mouse.click && mouse.move && mouse.pos_prev) {
//     //send line to the server
//     socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev] });
//     mouse.move = false;
//   }

//   mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
//   setTimeout(mainLoop, 25);
// }

// mainLoop();

// });

//========================
// Alternative Draw code

document.addEventListener("DOMContentLoaded", function() {
console.log('ready');

var boardDiv = document.getElementById('boardDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', 1000);
canvas.setAttribute('height', 1000);
canvas.setAttribute('id', 'canvas');
boardDiv.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

context = canvas.getContext("2d");

$('#canvas').mousedown(function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  userDraw = true;
  addClick(mouseX, mouseY);
  redraw();
})

$('#canvas').mousemove(function(e) {
  if (userDraw) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e) {
  userDraw = false;
});

$('#canvas').mouseleave(function(e) {
  userDraw = false;
})

// function that will save click position
var clickX = [];
var clickY = [];
var clickDrag= [];
var userDraw;

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  if(curTool === "eraser"){
    clickColor.push(colorWhite);
  } else{
  clickColor.push(curColor);
}
  //clickColor.push(curColor);
  clickSize.push(curSize);
}

// function that clears canvas is everything redrawn

function redraw() {
  //clear canvas
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  //context.strokeStyle = "#df4b26";
  //context.lineJoin = "round";
  //context.lineWidth = 1;

  for(var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i) {
      context.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      context.moveTo(clickX[i]-1, clickY[i]);
    }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.strokeStyle = clickColor[i];
      context.lineWidth = clickSize[i];
      context.stroke();
    }
  }


//Color Palette
var colorBlue = "#0000ff";
var colorRed = "#ff0000";
var colorYellow = "#ffff00";
var colorBlack = "#000000";
var colorWhite = "#ffffff"

var curColor = colorBlack;
var clickColor = [];

//Color buttons
$('button#blue').on('click',function(){
  curColor = colorBlue;
})

$('button#red').on('click',function(){
  curColor = colorRed;
})

$('button#yellow').on('click',function(){
  curColor = colorYellow;
})

$('button#black').on('click',function(){
  curColor = colorBlack;
})

//Size Selection
var normal = 3;
var small = 1;
var large = 5;

var curSize = normal;
var clickSize = [];

//Size buttons
$('button#normal').on('click', function() {
  curSize = normal;
})

$('button#small').on('click', function() {
  curSize = small;
})

$('button#large').on('click', function() {
  curSize = large;
})

//Eraser

var clickTool = [];
var curTool = "pencil";

$('button#eraser').on('click', function() {
  curTool = "eraser";
});

$('button#pencil').on('click', function() {
  curTool = "pencil";
});





})
