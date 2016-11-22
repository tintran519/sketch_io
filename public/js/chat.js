//chatio
console.log('chat loaded');
var messages = document.getElementById('messages');
var newMsg = document.getElementById('new-msg');
var userName = document.getElementById('user-name');

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
  console.log('addMessage')

  //display as Li list
  messages.innerHTML += ['<li><strong>', data.name, ':</strong> ', data.msg + '</li>'].join('');
  console.log('innerHTML', messages.innerHTML)
}
