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


class SingleQuestion {
	constructor(question, answer){
		this.question = question
		this.answer = answer
	}
}


let setList= ()=> {
  	let hello = 'hello.txt';
  	let readed = fs.readFileSync(hello, 'utf8');
  	let rl = readed.split('||')
	let dict = {}
	for (chunk of rl) {
		let categoryName = chunk.split('--')[0].trim()
		let questions = chunk.split('--')[1]
		qSplit = questions.split('>>')
		subdict = {}
		for (let ind = 1; ind < qSplit.length; ind ++) {
			let question = qSplit[ind].split('>')[0].trim()
			let answer = qSplit[ind].split('>')[1].trim()

			subdict[(ind)*100] = new SingleQuestion( question, answer )
		}
		dict[categoryName] = subdict


	}
	console.log(dict)
  

}
  
setList()





class Game {
  constructor( file ) {
  }
}




let h = []
