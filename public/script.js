const socket = io.connect("http://localhost:3000");
// ...top of script tag
socket.on('newMessage', addMessage);
socket.on('newUser', addUser);

socket.on("userList", (userArray) => {
    userArray.map((item) => {
        addUser({ username : item })
    })
})

socket.on('disconnected', (userArray) => {
    alert("Got Disconnected event");
    document.getElementById('userList').innerHTML = '';
    userArray.map((item) => {
        addUser({ username : item })
    });
});


function addMessage({name, message}) {
    $("#messages").append(`<h4>${name}</h4><p>${message}</p>`);
}

function addUser({username}) {
    $("#userList").append(`<li class="list-group-item"  >${username}</li>`);
}

function buttonClicked() {

    let name = document.getElementById("name");
    let message = document.getElementById("message");

    socket.emit('message', { name : name.value, message : message.value })
    name.style.display = "none";
    message.value = '';
}
