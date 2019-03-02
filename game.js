'use strict';

//var jso = require('JSON.parse')
const fs = require('fs');
const net= require('net');
// files will be created by server of the form:
//
// 
// {
//   "section 1"
//   --
//   >>"question 1"
//   >"answer 1"
//   >>"question 2"
//   >"answer 3"
//   >>"question 3"
//   >"answer 3"
//   ||
//   "section 2"
//   --
//   >>"question 1"
//   >"answer 1"
//   ...




const host = 'localhost';
const port = 8016;


class Player {
	constructor(username) {
		this.name = username;
		this.score = 0;
	}
	changeScore(amount){
		this.score += amount;
	}
}

class SingleQuestion {
	constructor(question, answer){
		this.question = question;
		this.answer = answer;
		this.done = false;
	}
	markComplete() {
		this.done = true;
	}
}




class main  {
	constructor(file) {
		let readed = fs.readFileSync(file, 'utf8');
		let rl = readed.split('\n||\n');
		let dict = {};
		for (let chunk of rl) {
			let categoryName = chunk.split('\n--')[0].trim();
			let questions = chunk.split('\n--')[1];
			let qSplit = questions.split('\n>>');
			let subdict = {};
			for (let ind = 1; ind < qSplit.length; ind ++) {
				let question = qSplit[ind].split('\n>')[0].trim();
				let answer = qSplit[ind].split('\n>')[1].trim();

				subdict[(ind)*100] = new SingleQuestion( question, answer );
			}
			dict[categoryName] = subdict;
		}
		
		this.state = dict;
		this.players = [];
		this.names = [];
		this.start = false;
	}
	addPlayer(name) {
		if (!(this.names.includes(name))) {
			this.players.push(new Player(name));
			this.names.push(name);
		}
		
		else {
			console.log('player already exists.');
		}
	}

	rmvPlayer(name) {
		let idx = this.names.indexOf(name);
		if (idx != -1){
			this.players.splice(idx,1);
			this.names.splice(idx,1);
		}
		else {
			console.log('this player doesn\'nt exist.');
		}
	}


	modifyScore(name, amount) {

		this.players[this.names.indexOf(name)].changeScore(amount);
	}

	answerQuestion(name, category, amount, correct) {
		if (this.state[category][amount].done) {
			console.log('this question was answered already.');
		}
		else if (correct) {
			this.modifyScore(name, amount);
			this.state[category][amount].markComplete();
		}
		else {
			this.modifyScore(name, -1*amount);
		}
	}
	begin() {
		this.start = true;
	}
}

	
//create an instance of the game.
let h =new main('hello.txt');

let players = [];
let playerID = 0;

let master;
function writeToMaster() {}


const server = net.createServer( (socket) => {
	console.log('someone appeared');
	
	socket.on('data', (data) => {
		// data will be of the form 'name' (to identify who joined/buzzed)
		// spaces will be changed to underscores
		// or of the form 'admin name' for the master
		let ident = data.toString();
		console.log( ident);
		let answerers = [];
		if (h.start) {
			if (!(socket.id	== 'master')) {
				answerers.push(socket.id);
			}
		}
		else {
			// true if player, false if master
			if (2 - ident.split(' ').length) {

				socket.write('welcome\r\n');
				socket.pipe(socket);
				socket.id = playerID ++;
				players.push(socket);
			}
			else {
				socket.id = 'master'
				master = socket
			}
		}
	});

	socket.on('close', () => {
		if (socket.id != 'master') {
			for (let i = 0; i < players.length; i++) {
				if (players[i].id == socket.id) {
					players.splice(i, 1);
				}
			}
			console.log(socket.id + ' has disconnected');
		}
		
	})

	socket.on('error', () => {
	})




});
	
server.listen(port, host, () => {
	console.log('listening...')
})

