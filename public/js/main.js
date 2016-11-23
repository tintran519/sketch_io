console.log('JS loaded!');
var socket = io();
document.addEventListener("DOMContentLoaded", function() {

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

  console.log(width);
  canvas.width = 690;
  canvas.height = 690;

  //Mouse event handlers
  canvas.onmousedown = function(e) {
    mouse.click = true;
  }

  canvas.onmouseup = function(e) {
    mouse.click = false;
  }

  //normalize mouse position to range 0.0 - 1.0 to allow screen adaptiblity
  canvas.onmousemove = function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.pos.x = Math.floor((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
    mouse.pos.y = Math.floor((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)+20;
    mouse.move = true;
  };

  //draw line client is listening for from server
  socket.on('draw_line', function (data) {
    switch(data.shape) {
      case "triangle":
        drawTriangle(data);
        break;
      case "line":
        var line = data.line;
        context.beginPath();
        context.lineWidth = data.size;
        context.strokeStyle = data.color;
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y);
        context.stroke();
        break;
      case "square":
        drawSquare(data);
        break;
      case "circle":
        drawCircle(data);
        break;
    }
  });


  //main loop, running every 25ms
  function mainLoop() {
    //checks if user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      if (curTool === "eraser") {
        curColor = colorWhite;
        curShape = "square";
        Fill = true;
      }
      //send line to the server
      socket.emit('draw_line', {
        line: [ mouse.pos, mouse.pos_prev],
        color: curColor,
        size: curSize,
        shape: curShape,
        fill: Fill,
        tool: curTool
      });
      mouse.move = false;
    }

    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 25);
  }

  mainLoop();

// //Color Palette
var colorBlue = "#0000ff";
var colorRed = "#ff0000";
var colorYellow = "#ffff00";
var colorBlack = "#000000";
var colorWhite = "#ffffff"
var colorGreen = "#008000";

//Default Color
curColor = colorBlack;


//Color Toggle
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

$('button#green').on('click',function(){
  curColor = colorGreen;
})

//Clear Board
function clear(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

//Clear button
$('button#clear').on('click', clear);

//Eraser
curTool = "pencil";

//Eraser buttons
$('button#eraser').on('click', function() {
  curTool = "eraser";
  canvas.style.cursor = "url('http://www.rw-designer.com/oce/res/eraser.png'), auto";
});

$('button#pencil').on('click', function() {
  curTool = "pencil";
  curColor = colorBlack;
  curShape = "line";
  canvas.style.cursor = "url('http://www.rw-designer.com/oce/res/pencil.png'), auto";
});


//Size Selection
var normal = 3;
var small = 1;
var large = 7;

//Default Size
curSize = normal;

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


//Shapes
//Default shape
curShape = "line"

//Functions that draws shapes
function drawTriangle (data) {
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[1].x + 25, line[1].y + 25);
    context.lineTo(line[1].x + 25, line[1].y - 25);
    context.closePath();
    if (data.fill) {
      context.fillStyle = data.color;
      context.fill();
    } else {
      context.strokeStyle = data.color;
      context.stroke();
  }
};


function drawSquare (data) {
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[1].x + 25, line[1].y);
    context.lineTo(line[1].x + 25, line[1].y + 25);
    context.lineTo(line[1].x, line[1].y + 25);
    context.closePath();
    if (data.fill) {
      context.fillStyle = data.color;
      context.fill();
    } else {
      context.strokeStyle = data.color;
      context.stroke();
  }
};


function drawCircle (data) {
    var line = data.line;
    context.beginPath();
    context.arc(line[1].x, line[1].y, 25, 0, 2*Math.PI);
    context.closePath();
      if (data.fill) {
        context.fillStyle = data.color;
        context.fill();
      } else {
        context.strokeStyle = data.color;
        context.stroke();
    }
};

//Solid or Outline
  Fill = false;

$('button#fill').on('click', function(){
  Fill = true;
})

$('button#outline').on('click', function(){
  Fill = false;
})
//Shape buttons
$('button#triangle').on('click', function() {
  curShape = "triangle";
});

$('button#line').on('click', function() {
  curShape = "line";
});

$('button#square').on('click', function() {
  curShape = "square";
});

$('button#circle').on('click', function() {
  curShape = "circle";
});

//Sliding footer
$(".footer").hover(function () {
  $(".slide").slideToggle("fast");
});
});


//========================
// Alternative Draw code

//  document.addEventListener("DOMContentLoaded", function() {
// console.log('ready');

// //Socket Implementation
// var socket = io();
// console.log(socket);



// var boardDiv = document.getElementById('boardDiv');
// canvas = document.createElement('canvas');
// canvas.setAttribute('width', 1000);
// canvas.setAttribute('height', 1000);
// canvas.setAttribute('id', 'canvas');
// boardDiv.appendChild(canvas);
// if(typeof G_vmlCanvasManager != 'undefined') {
//   canvas = G_vmlCanvasManager.initElement(canvas);
// }

// context = canvas.getContext("2d");

// $('#canvas').mousedown(function(e) {
//   var mouseX = e.pageX - this.offsetLeft;
//   var mouseY = e.pageY - this.offsetTop;

//   drawData.userDraw = true;
//   addClick(mouseX, mouseY);
//   socket.emit('drawn_line', drawData);
//   console.log('mousedown sent message',drawData.userDraw);
// })

// $('#canvas').mousemove(function(e) {
//   socket.on('end_line', function (data) {
//     console.log('checking if userDraw true/false',data.userDraw);
//     drawData.userDraw = data.userDraw;
//   })
//   if (drawData.userDraw) {
//     addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);

//     console.log('mousemove sent message', drawData);
//   }
// });

// setInterval(function () {
//   socket.emit('drawn_line', drawData);
//   truncateDrawData()
// }, 100)

// function truncateDrawData () {
//   drawData.x = []
//   drawData.y = []
//   drawData.drag = []
//   drawData.fill = []
//   drawData.shape = []
//   drawData.size = []
//   drawData.color = []
// }

// $('#canvas').mouseup(function(e) {
//   userDraw = false;
//   socket.emit('end-line', {userDraw: false})
// });

// $('#canvas').mouseleave(function(e) {
//   userDraw = false;
//   socket.emit('end-line', {userDraw: false})

// })

// socket.on('receive', function(sDrawData){
//   console.log('mousemove received message',sDrawData);
//   redraw(sDrawData);
// })

// // function that will save click position
// var clickX = [];
// var clickY = [];
// var clickDrag= [];
// var userDraw;

// function addClick(x, y, dragging) {
//   clickX.push(x);
//   clickY.push(y);
//   clickDrag.push(dragging);
//   if(curTool === "eraser"){
//     clickColor.push(colorWhite);
//   } else{
//   clickColor.push(curColor);
// }
//   clickSize.push(curSize);
//   clickShape.push(curShape);
//   clickFill.push(Fill);
//   console.log('here i am', drawData);
// }


// // function that clears canvas is everything redrawn

// function redraw(data) {
//   console.log('this is redraw function',data);
//   //clear canvas to allow next set of drawing parameters
//   //context.clearRect(0, 0, context.canvas.width, context.canvas.height);

//   //context.strokeStyle = "#df4b26";
//   //context.lineJoin = "round";
//   //context.lineWidth = 1;

//   for(var i = 0; i < data.x.length; i++) {
//     curShape = data.shape[i];
//     Fill = data.fill[i];
//     context.beginPath();
//     if(curShape === "triangle") {
//         drawTriangle(data.x,data.y,i);
//     } else if(curShape === "square") {
//         drawSquare(i);
//     } else if(curShape === "circle") {
//         drawCircle(i);
//       }
//      else{


//     if(data.drag[i] && i) {
//       context.moveTo(data.x[i-1], data.y[i-1]);
//     } else {
//       context.moveTo(data.x[i], data.y[i]);
//     }
//       context.lineTo(data.x[i], data.y[i]);
//       context.strokeStyle = data.color[i];
//       context.lineWidth = data.size[i];
//       context.stroke();
//       context.closePath();
//     }
//    }
//   }

// //======================
// // function redraw() {
// //   //clear canvas to allow next set of drawing parameters
// //   context.clearRect(0, 0, context.canvas.width, context.canvas.height);

// //   //context.strokeStyle = "#df4b26";
// //   context.lineJoin = "round";
// //   //context.lineWidth = 1;

// //   for(var i = 0; i < clickX.length; i++) {
// //     curShape = clickShape[i];
// //     Fill = clickFill[i];
// //     context.beginPath();
// //     if(curShape === "triangle") {
// //         drawTriangle(i);
// //     } else if(curShape === "square") {
// //         drawSquare(i);
// //     } else if(curShape === "circle") {
// //         drawCircle(i);
// //       }
// //      else{


// //     if(clickDrag[i] && i) {
// //       context.moveTo(clickX[i-1], clickY[i-1]);
// //     } else {
// //       context.moveTo(clickX[i], clickY[i]);
// //     }
// //       context.lineTo(clickX[i], clickY[i]);
// //       context.strokeStyle = clickColor[i];
// //       context.lineWidth = clickSize[i];
// //       context.stroke();
// //       context.closePath();
// //     }
// //    }
// //   }
// //=============

// //Color Palette
// var colorBlue = "#0000ff";
// var colorRed = "#ff0000";
// var colorYellow = "#ffff00";
// var colorBlack = "#000000";
// var colorWhite = "#ffffff"

// var curColor = colorBlack;
// var clickColor = [];

// //Color buttons
// $('button#blue').on('click',function(){
//   curColor = colorBlue;
// })

// $('button#red').on('click',function(){
//   curColor = colorRed;
// })

// $('button#yellow').on('click',function(){
//   curColor = colorYellow;
// })

// $('button#black').on('click',function(){
//   curColor = colorBlack;
// })

// //Size Selection
// var normal = 3;
// var small = 1;
// var large = 7;

// var curSize = normal;
// var clickSize = [];

// //Size buttons
// $('button#normal').on('click', function() {
//   curSize = normal;
// })

// $('button#small').on('click', function() {
//   curSize = small;
// })

// $('button#large').on('click', function() {
//   curSize = large;
// })

// //Eraser
// var clickTool = [];
// var curTool = "pencil";

// //Eraser buttons
// $('button#eraser').on('click', function() {
//   curTool = "eraser";
// });

// $('button#pencil').on('click', function() {
//   curTool = "pencil";
// });

// //Shapes
// var clickShape = [];
// var curShape = "line"

// function drawTriangle (x,y,i) {
//       context.moveTo(x[i], y[i]);
//       context.lineTo(x[i]+25, y[i]+25);
//       context.lineTo(x[i]+25, y[i]-25);
//       context.closePath();
//       if (Fill) {
//         context.fillStyle = clickColor[i];
//         context.fill();
//       } else {
//         context.strokeStyle = clickColor[i];
//         context.stroke();
//     }
// };

// function drawSquare (i) {
//       context.moveTo(clickX[i], clickY[i]);
//       context.lineTo(clickX[i]+25, clickY[i]);
//       context.lineTo(clickX[i]+25, clickY[i]+25);
//       context.lineTo(clickX[i], clickY[i]+25);
//       context.closePath();
//       if (Fill) {
//         context.fillStyle = clickColor[i];
//         context.fill();
//       } else {
//         context.strokeStyle = clickColor[i];
//         context.stroke();
//     }
// };


// function drawCircle (i) {
//   context.arc(clickX[i], clickY[i], 25, 0, 2*Math.PI);
//       if (Fill) {
//         context.fillStyle = clickColor[i];
//         context.fill();
//       } else {
//         context.strokeStyle = clickColor[i];
//         context.stroke();
//     }
// };

// //Solid or Outline
// var clickFill = [];
// var Fill = false;

// $('button#fill').on('click', function(){
//   Fill = true;
// })

// $('button#outline').on('click', function(){
//   Fill = false;
// })
// //Shape buttons
// $('button#triangle').on('click', function() {
//   curShape = "triangle";
// });

// $('button#line').on('click', function() {
//   curShape = "line";
// });

// $('button#square').on('click', function() {
//   curShape = "square";
// });

// $('button#circle').on('click', function() {
//   curShape = "circle";
// });


// //Clear
// function clear(){
//   clickX = [];
//   clickY = [];
//   clickDrag= [];
//   clickColor = [];
//   clickSize = [];
//   clickShape = [];
//   userDraw;
//   redraw();
//   // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
// }

// //Clear button
// $('button#clear').on('click', clear);

// //Socket
// //var sessionId = io.socket.sessionid;
// drawData = {
//   x: clickX,
//   y: clickY,
//   drag: clickDrag,
//   userDraw: userDraw,
//   color: clickColor,
//   shape: clickShape,
//   fill: clickFill,
//   size: clickSize
// };

// // socket.emit('drawn_line', drawData);
// // console.log(drawData);


// // socket.on('drawn_line', function(data) {

// // })

//  });

