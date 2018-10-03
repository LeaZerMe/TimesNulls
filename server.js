const express    = require('express');
const bodyParser = require('body-parser');
const socketio   = require('socket.io');
const app = express();
const uuid = require('uuid');

const port = 3000;
const server = app.listen(port, () => console.log('App listening on port ' + port));

const websocket = socketio(server);

const defaultArr = [{id: 1, title: ""},{id: 2, title: ""},{id: 3, title: ""},
{id: 4, title: ""},{id: 5, title: ""},{id: 6, title: ""},
{id: 7, title: ""},{id: 8, title: ""},{id: 9, title: ""}
];

let usersList = {},
roomList = {s: {
	queue: "X",
	next: "";
}};

websocket.on('connection', (socket) => {
	console.log('A client just joined on', socket.id);
	usersList[socket.id] = {id: socket.id}; 

	socket.on('step', (data) => {
		if(roomList.s.queue == "X") {
			roomList.s.queue = "O"
		} else {
			roomList.s.queue = "X"
		}

		if(data == 'end') {
			websocket.to(usersList[socket.id].room).emit('endGame', defaultArr);
			return;
		}
		websocket.to(usersList[socket.id].room).emit('callbackBoutStep', data)
	})

	socket.on('alertAboutEnd', (data) => {
		websocket.to('s').emit('animIt', data)
	})

	socket.on('startGame', () => {
		let id = uuid.v4();
		usersList[socket.id].room = id;
		
		roomList[id] = {name: id, users: [], gameStarted: false};
		roomList[id].users.push(socket.id);
		if()
		socket.join(id);
	})

	socket.on('cancelGame', () => {
		socket.leave(usersList[socket.id].room);
		delete roomList[usersList[socket.id].room];
	})
});

