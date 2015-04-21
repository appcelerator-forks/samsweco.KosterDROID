var letters = Alloy.Collections.letterModel;
letters.fetch({query : 'select * from letterModel'});

Ti.API.info(JSON.stringify(letters));
	
function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.value;
	alert(letter);
	return letter.toUpperCase();
}

function checkLetter(letterToCheck) {
	
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
