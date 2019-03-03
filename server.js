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
const playerport = 8016;
const masterport = 8418;


class Player {
	constructor(username) {
		this.name = username;
		this.score = 0;
		this.canAnswer = true
	}
	changeScore(amount){
		this.score += amount;
	}}

class SingleQuestion {
	constructor(question, answer, amount){
		this.question = question;
		this.answer = answer;
		this.amount = amount
		this.done = false;
	}
	markComplete() {
		this.done = true;
	}}




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

				subdict[(ind)*100] = new SingleQuestion( question, answer , ind*100);
			}
			dict[categoryName] = subdict}

		this.currentQuestion = null;
		this.currentPlayer = null;
		this.state = dict}

	modifyScore(amount) {
		players[this.currentPlayer].score += amount}

	markCurrentQuestionComplete() {
		this.currentQuestion.markComplete()
		this.currentQuestion = null}
}

	
//create an instance of the game.
let theGame =new main('hello.txt');


// id : name
const players = {}

// waiting:before the game has started
// selecting: master selects a category and points amount
// playing: players buzz
// reviewing: master determines whether answer is right

var gameStatus = 'waiting'



let playerID = 0;

let master = {}

// Used to probably signal when buzzing is allowed
function writetoPlayers() {}


function enableAnswers() {
	// allows players who have already buzzed to buzz again.
	for (let id in players) {
		players[id].canAnswer = true}
}





const playerserver = net.createServer( (player) => {
	
	player.added = false

	player.on('data', (data) => {

		//players shouldn't be able to do anything when
		//selecting or revieweing

		// First message from player should be of form 'PLAYER player_name'
		if (gameStatus == 'waiting') {
			if (!player.added && (data.toString().search('PLAYER') == 0)) {
				
				// create a unique id by adding 1
				player.id = playerID ++

				// set id:Player{name:name, score:0}
				players[player.id] = new Player(data.toString().trim().split(' ')[1])
				
				player.added = true
			}
		}

		else if (gameStatus == 'playing' && players[player.id].canAnswer) {
			players[player.id].canAnswer = false
			gameStatus = 'reviewing'
			theGame.currentPlayer = player.id
		}
	});
	player.on('close', () => {
		// maybe not delete if we want score to be kept.
		delete players[player.id]
	});
});
	
const masterserver = net.createServer( (socket) => {

	socket.on('data', (data) => {
		let received = data.toString().trim()
		console.log(received)
		if (received == 'stat') {
			console.log(theGame.state)
		}
		if (gameStatus == 'waiting') {
			
			// checks if master does not yet exist
			if(!master.name && received.search('MASTER') == 0 && received.split(' ').length == 3){
				master.name  = received.split(' ')[1]
				master.id  = 'M' + received.split(' ')[2]
				console.log(master)
			}
			else if (received == 'GAME_BEGIN') {
				console.log('began')
				gameStatus = 'selecting'
			}
			else if (master.name && received.search('MASTER') == 0){
				socket.destroy()
			}
		}
		else if (gameStatus == 'selecting') {
			// form 'SELECT category amount'
			if (received.search('SELECT') == 0 && received.split(' ').length == 3) {
				//current question is now a class instance
				theGame.currentQuestion = theGame.state[received.split(' ')[1]][received.split(' ')[2]]
				gameStatus = 'playing'
			}
		}
		else if (gameStatus == 'playing') {
			if (received == 'QUESTION_SKIP') {
				//mark question complete, proceed to selecting
				theGame.markCurrentQuestionComplete()
				enableAnswers()
				gameStatus = 'selecting'
			}
		}
		else if (gameStatus == 'reviewing') {
			if (received == 'QUESTION_SKIP') {
				//mark complete, proceed to selecting
				theGame.markCurrentQuestionComplete()
				enableAnswers()
				gameStatus = 'selecting'
			}
			else if (received == 'QUESTION_CORRECT') {
				//mark complete, add points, proceed to selecting
				theGame.modifyScore(theGame.currentQuestion.amount)
				theGame.markCurrentQuestionComplete()
				enableAnswers()
				gameStatus = 'selecting'
			}
			else if (received == 'QUESTION_INCORRECT') {
				//subtract points, proceed to playing
				theGame.modifyScore(-1*theGame.currentQuestion.amount)
				gameStatus = 'playing'
			}
		}
				

	});  //end on 'data'
	socket.on('close', () => {
		delete master.name
		delete master.id
	});  //end on 'close'
				
	
});


playerserver.listen(playerport, host, () => {})
masterserver.listen(masterport, host, () => {})



// log updates to console
setInterval(() => {
	console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
	console.log('-------\n')
	console.log(players)
	console.log(master)
	console.log(gameStatus)
	console.log(theGame.currentQuestion)
	console.log('\n')
}, 3000);

