function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.value;
	return letter;
}

function checkLetter(letterToCheck) {
	
	var letters = getLetterCollection();
	letters.fetch();
	
	var letterJSON = letters.toJSON();
	
	for (var i = 0; i < letterJSON.length; i++) {
		if (letterJSON[i].letter == letterToCheck) {
			//Save letter
			lettersArray.push(letterJSON[i].letter);
			$.lblLetters.text += letterJSON[i].letter;
			alert(letterJSON[i].letter);
		}
	}
}
