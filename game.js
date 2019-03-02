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
	}
	changeScore(amount){
		this.score += amount;
	}}

class SingleQuestion {
	constructor(question, answer){
		this.question = question;
		this.answer = answer;
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

				subdict[(ind)*100] = new SingleQuestion( question, answer );
			}
			dict[categoryName] = subdict}

		this.currentQuestion = null;
		this.currentPlayer = null;
		this.state = dict}

	modifyScore(amount) {
		players[this.currentPlayer][1] += amount}

	markComplete() {
		this.state[currentQuestion[0]][currentQuestion[1]].markComplete()}
}

	
//create an instance of the game.
let theGame =new main('hello.txt');


// id : name
const players = {}

// waiting:before the game has started
// selecting: master selects a category and points amount
// playing: players buzz
// reviewing: master determines whether answer is right

gameStatus = 'waiting'



let playerID = 0;

let master= null;

// Used to probably signal when buzzing is allowed
function writetoPlayers() {}



const playerserver = net.createServer( (player) => {
	
	player.added = false

	player.on('data', (data) => {

		//players shouldn't be able to do anything when
		//selecting or revieweing

		if (gameStatus == 'waiting') {
			if (!player.added) {
				
				// create a unique id by adding 1
				player.id = playerID ++

				// set id:name
				players[player.id] = [data.toString().trim(), 0]
				player.added = true

		else if (gameStatus == 'playing') {

			gameStatus = 'reviewing'
			theGame.currentPlayer = player.id
});
	
const masterserver = net.createServer( (socket) => {
	
});


playerserver.listen(playerport, host, () => {})
masterserver.listen(masterport, host, () => {})

