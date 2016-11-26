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
  canvas.width = $('#drawBoard').width();
  canvas.height = $('#drawBoard').height();

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
  if(confirm("Clear your canvas?") == true)
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

//Clear button
$('button#clear').on('click', clear);

//Eraser
curTool = "pencil";

//Eraser buttons
$('button#eraser').on('click', function() {
  curTool = "eraser";
  canvas.style.cursor = "url('../eraser.png'), auto";
});

$('button#pencil').on('click', function() {
  curTool = "pencil";
  curColor = colorBlack;
  curShape = "line";
  canvas.style.cursor = "url('../pencil.png'), auto";
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
$(".footer").on('click',function () {
  $(".slide").slideToggle("slow");
});

//Toggle Chat
var toggle = 0
$("#chat_bubble").on('click', function(event) {
  event.preventDefault();
  if (toggle === 1) {
    //not clicked
    closeChat();
    $(this).removeClass('clicked');
    toggle = 0;
  } else {
    //clicked
    openChat();
    $(this).addClass('clicked');
    toggle = 1;
  }
})
//opens chat
function openChat(){
  $(".right-half").addClass('open');
  // $(".row").css('right','33%');
}

function closeChat(){
  $(".right-half").removeClass('open');
  // $(".row").css('right','0%');
}

});
