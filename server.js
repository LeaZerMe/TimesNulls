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
freeRooms = [],
roomList = {};

websocket.on('connection', (socket) => {
	console.log('A client just joined on', socket.id);
	usersList[socket.id] = {id: socket.id}; 

	socket.on('step', (data) => {
		if(roomList[usersList[socket.id].room].queue == "X") {
			roomList[usersList[socket.id].room].queue = "O"
		} else {
			roomList[usersList[socket.id].room].queue = "X"
		}

		if(data == 'end') {
			websocket.to(usersList[socket.id].room).emit('endGame', defaultArr);
			return;
		}

		let nameOfNext;
		if(usersList[roomList[usersList[socket.id].room].users[0]].name != roomList[usersList[socket.id].room].next) {
			nameOfNext = usersList[roomList[usersList[socket.id].room].users[0]].name;
			roomList[usersList[socket.id].room].next = usersList[roomList[usersList[socket.id].room].users[0]].name;
		} else {
			nameOfNext = usersList[roomList[usersList[socket.id].room].users[1]].name;
			roomList[usersList[socket.id].room].next = usersList[roomList[usersList[socket.id].room].users[1]].name;
		}

		websocket.to(usersList[socket.id].room).emit('callbackBoutStep', data, roomList[usersList[socket.id].room].queue, nameOfNext)
	})

	socket.on('alertAboutEnd', (data, obj) => {
		websocket.to(usersList[socket.id].room).emit('animIt', data, obj)
	})

	socket.on('startSeekGame', (name) => {
		if(!freeRooms.length) {
			let id = uuid.v4();
			usersList[socket.id].room = id;
			usersList[socket.id].name = name;
			freeRooms.push(id);

			roomList[id] = {name: id, users: [], gameStarted: false, next: "", queue: "X"};
			roomList[id].users.push(socket.id);
			socket.join(id);
		} else {
			let id = freeRooms.shift();
			usersList[socket.id].room = id;
			usersList[socket.id].name = name;

			roomList[id].gameStarted = true;
			roomList[id].users.push(socket.id);
			roomList[id].next = roomList[id].users[(Math.random().toFixed(0))];

			socket.join(id);
			websocket.to(usersList[socket.id].room).emit('startGame', name);
		}		
	})

	socket.on('cancelSeekGame', () => {
		socket.leave(usersList[socket.id].room);

		if(roomList[usersList[socket.id].room].users[0] == socket.id) {
			freeRooms.splice(freeRooms.indexOf(usersList[socket.id].room), 1);
			delete roomList[usersList[socket.id].room];
		}
	})
});

