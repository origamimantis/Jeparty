//var jso = require('JSON.parse')
let fs = require('fs')

// files will be created by server of the form:
//
// 
// {
//   "section 1"
//   >"question 1"
//   >>"answer 1"
//   >"question 2"
//   >>"answer 3"
//   >"question 3"
//   >>"answer 3"
//   ||
//   "section 2"
//   >"question 1"
//   >>"answer 1"
//   ...

class Player {
	constructor(username) {
		this.name = username
		this.score = 0
	}
	changeScore(amount){
		this.score += amount
	}
}

class SingleQuestion {
	constructor(question, answer){
		this.question = question
		this.answer = answer
		this.done = false
	}
	markComplete() {
		this.done = true
	}
}




class main  {
	constructor(file) {
		let readed = fs.readFileSync(file, 'utf8');
		let rl = readed.split('\n||\n')
		let dict = {}
		for (let chunk of rl) {
			let categoryName = chunk.split('\n--')[0].trim()
			let questions = chunk.split('\n--')[1]
			let qSplit = questions.split('\n>>')
			let subdict = {}
			for (let ind = 1; ind < qSplit.length; ind ++) {
				let question = qSplit[ind].split('\n>')[0].trim()
				let answer = qSplit[ind].split('\n>')[1].trim()

				subdict[(ind)*100] = new SingleQuestion( question, answer )
			}
			dict[categoryName] = subdict
		}
		
		this.state = dict
		this.players = []
		this.names = []
	}
	addPlayer(name) {
		if (!(this.names.includes(name))) {
			this.players.push(new Player(name))
			this.names.push(name)
		}
		
		else {
			console.log('player already exists.')
		}
	}

	rmvPlayer(name) {
		let idx = this.names.indexOf(name)
		if (idx != -1){
			this.players.splice(idx,1)
			this.names.splice(idx,1)
		}
		else {
			console.log('this player doesn\'nt exist.')
		}
	}


	modifyScore(name, amount) {

		this.players[this.names.indexOf(name)].changeScore(amount)
	}

	answerQuestion(name, category, amount, correct) {
		if (this.state[category][amount].done) {
			console.log('this question was answered already.')
		}
		else if (correct) {
			this.modifyScore(name, amount)
			this.state[category][amount].markComplete()
		}
		else {
			this.modifyScore(name, -1*amount)
		}
	}


}

	

let h =new main('hello.txt')

console.log(h.state)
console.log(h.players)

console.log('\neric joins\n')

h.addPlayer('eric')
console.log(h.players)

console.log('\nbob is kicked out\n')

h.rmvPlayer('bob')
console.log(h.players)


console.log('\neric joins\n')

h.addPlayer('eric')
console.log(h.players)

console.log('\nmax joins\n')

h.addPlayer('max')
console.log(h.players)

console.log('\narcq joins\n')

h.addPlayer('arcq')
console.log(h.players)

console.log('\narcq is kicked out\n')

h.rmvPlayer('arcq')
console.log(h.players)

console.log('\neric gets 100 points\n')

h.modifyScore('eric', 100)
console.log(h.players)

console.log('\neric correctly answers People 200\n')

h.answerQuestion('eric','People',200,true)
console.log(h.state)
console.log(h.players)

console.log('\nmax incorrectly answers IDEs 100\n')

h.answerQuestion('max','IDEs',100,false)
console.log(h.state)
console.log(h.players)

console.log('\neric correctly answers IDEs 100\n')

h.answerQuestion('eric','IDEs',100,true)
console.log(h.state)
console.log(h.players)

console.log('\nmax correctly answers IDEs 100\n')

h.answerQuestion('max','IDEs',100,true)
console.log(h.state)
console.log(h.players)
