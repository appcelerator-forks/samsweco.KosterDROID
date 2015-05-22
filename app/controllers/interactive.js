Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");

var args = arguments[0] || {};

var foundLetterId = 1;
var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

$.lblInfoText.text = "Vandra äventyrslingan och leta efter de 9 bokstäverna som finns gömda längs leden! Försök sedan klura ut det hemliga ordet. Längs vägen kommer du få ledtrådar som hjälper dig finna bokstäverna. Du kan se bokstävernas ungefärliga läge med hjälp av gröna plupparna. Vi kommer även påminna dig när du börjar närma dig en bokstav.";

//-----------------------------------------------------------
// Hämtar letterCollection
//-----------------------------------------------------------
try {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();
	jsonCollection = letterCollection.toJSON();
	Alloy.Globals.jsonCollection = jsonCollection;
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - create letterCollection");
}

displayMap();

function displayMap() {
	$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
	addClueZone();
	displaySpecificMarkers(7, interactiveMap);
}

function startInteractive() {
	if (Ti.Geolocation.locationServicesEnabled) {
		getUserPos('letter');
		loadClue(foundJSON.length + 1);
		interactiveGPS = true;

		$.btnStartQuiz.hide();
		$.btnStartQuiz.height = 0;

		$.txtLetter.show();
		$.txtLetter.height = '35dp';

		$.lblLetters.show();
		$.lblLetters.height = '40dp';

		$.lblCollectedLetters.show();
		$.lblCollectedLetters.text = 'Bokstäver: ';

		$.viewNext.show();
		$.viewNext.height = '60dp';

		$.horizontalView.show();
		$.horizontalView.height = '75dp';
	} else {
		alert('Tillåt gpsen för att kunna få påminnelser, tack');
	}
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
$.nextClue.addEventListener('click', function() {
	var nextDialog = Ti.UI.createAlertDialog({
		title : 'Gå till nästa',
		message : 'Är du säker på att du inte hittar bokstaven?',
		buttonNames : ['Ja, visa nästa ledtråd', 'Stäng']
	});

	nextDialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			if (lettersModel.get('found') != 1) {
				checkLetter(lettersModel.get('letter'));
				$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
			}
		}
	});

	nextDialog.show();
});

function loadClue(id) {
	$.lblWelcome.text = "Ledtråd " + id + ":";
	$.lblInfoText.text = jsonCollection[id - 1].clue;
}

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var sendletter = letter.toUpperCase();

		checkLetter(sendletter);
		allLetters();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - sendLetter");
	}
}

//-----------------------------------------------------------
// Validerar bokstaven som skrivits in, sätter found till
// 1 i letterModel och läser upp nästa ledtråd
//-----------------------------------------------------------
function checkLetter(letterToCheck) {
	try {
		var messageDialog = Ti.UI.createAlertDialog();

		if (letterToCheck.length > 1) {
			messageDialog.message = "Man får bara skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['Stäng'];

			messageDialog.show();
		} else if (letterToCheck.length < 1) {
			messageDialog.message = "Man måste skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['Stäng'];

			messageDialog.show();
		} else {
			messageDialog.message = "Vill du spara bokstaven " + letterToCheck + "?";
			messageDialog.title = 'Spara bokstav';
			messageDialog.buttonNames = ['Ja, jag vill spara!', 'Stäng'];

			messageDialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					$.txtLetter.value = '';
					foundLettersModel.fetch({
						'id' : foundLetterId
					});

					foundLettersModel.set({
						'letter' : letterToCheck,
						'found' : 1
					});
					foundLettersModel.save();

					foundLetterId++;
					getFound();
					loadClue(foundJSON.length + 1);

					$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
				}
			});

			messageDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkLetter");
	}
}

function allLetters() {
	if (word.length == foundJSON.length) {
		$.txtLetter.hide();
		$.txtLetter.height = 0;
		$.lblLetters.hide();
		$.lblLetters.height = 0;
		$.btnStartQuiz.height = 0;
		$.wordView.show();
		$.wordView.height = Ti.UI.SIZE;
		$.viewNext.hide();
		$.viewNext.height = 0;

		$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
		$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.txtWord.value;
	var checkword = check.toUpperCase();
	var alertDialog = Ti.UI.createAlertDialog({
		buttonNames : ['Stäng']
	});

	if (checkword == word) {
		alertDialog.title = "Rätt ord!";
		alertDialog.message = "Bra jobbat! Du hittade det rätta ordet!";

		$.lblWelcome.text = "Bra jobbat!";
		$.lblWelcome.fontSize = '30dp';

		$.lblInfoText.text = "Du hittade det rätta ordet!";

		$.txtLetter.hide();
		$.txtLetter.height = '0dp';

		$.lblLetters.hide();
		$.lblLetters.height = '0dp';

		$.lblCollectedLetters.text = '';

		$.wordView.visible = false;
		$.wordView.height = 0;
		$.horizontalView.visible = false;
		$.horizontalView.height = 0;

		stopGame();
		startOver();
		interactiveGPS = false;
	} else if (wrongWord == 3) {
		alertDialog.title = 'Fel ord';
		alertDialog.message = "Nu blev det fel. Vill du kontrollera dina bokstäver? Det här är de korrekta: " + correctLetters;
	} else {
		alertDialog.title = "Fel ord";
		alertDialog.message = "Försök igen! Du har snart klurat ut det!";
		wrongWord++;
	}
}

Titanium.App.addEventListener('close', function() {
	startOver();
});

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
interactiveMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
}); 