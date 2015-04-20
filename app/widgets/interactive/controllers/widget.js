// var letterCollection = Alloy.Collections.letterModel;
// letterCollection.fetch();
// 
// var letterJSON = letterCollection.toJSON();

function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.text;
	return letter;
}

function checkLetter(letterToCheck) {
	for (var i = 0; i < letterJSON.length; i++) {
		if (letterJSON[i].letter == letterToCheck) {
			//Save letter
			lettersArray.push(letterJSON[i].letter);
			$.lblLetters.text += letterJSON[i].letter;
			alert(letterJSON[i].letter);
		}
	}
}
