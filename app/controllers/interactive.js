Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");

var args = arguments[0] || {};

//-----------------------------------------
// Onload
//-----------------------------------------------------------
displayMap();
checkIfStarted();

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function displayMap() {
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
		addClueZone();
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
		interactiveMap.addEventListener('click', function(evt) {
			if (evt.clicksource == 'rightButton') {
				showHotspot(evt.annotation.id);
			}
		});
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - display map");
	}

}

$.slides.addEventListener('scrollend', function(e) {
	try {
		removeClueZones();

		var clueIndex = ($.slides.getCurrentPage() + 1);
		addSpecificClueZone(clueIndex);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - evtlistener");
	}
});

setInteractiveViews();

function setInteractiveViews() {
	try {
		var letterJSON = fetchAllLetters();

		for (var i = 0; i < letterJSON.length; i++) {
			var letter_view = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : '85%',
				top : '0dp',
				layout : 'vertical'
			});

			var clueTitle = Ti.UI.createLabel({
				top : '5dp',
				left : '5dp',
				text : 'Ledtråd ' + (i + 1),
				color : '#FCAF17',
				font : {
					fontSize : '16dp',
					fontFamily : 'Raleway-Medium'
				}
			});

			var clueTxt = Ti.UI.createLabel({
				top : '2dp',
				text : letterJSON[i].clue,
				color : 'black',
				font : {
					fontSize : '14dp',
					fontFamily : 'Raleway-Light'
				}
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'white',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL
			});

			letter_view.add(clueTitle);
			letter_view.add(clueTxt);

			backgroundView.add(letter_view);

			$.slides.pagingControlColor = '#fed077';
			$.slides.addView(backgroundView);
		}
		
				var infoTxt = Ti.UI.createLabel({
				top : '2dp',
				text : 'Swipa åt sidan för att se nästa ledtråd',
				color : 'black',
				font : {
					fontSize : '14dp',
					fontFamily : 'Raleway-Light'
				}
			});
		
		$.slides.add(infoTxt);
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactive - set interactive views");
	}
}

//-----------------------------------------------------------
// Kickar igång spelet/jakten
//-----------------------------------------------------------
function startInteractive() {
	Ti.API.info("startad");
	try {
		if (!Ti.Geolocation.locationServicesEnabled) {
			var alertDialog = Ti.UI.createAlertDialog({
				title : 'Påminnelser',
				message : 'Tillåt gpsen för att kunna få påminnelser när du närmar dig en bokstav!',
				buttonNames : ['OK']
			});
			alertDialog.show();
		}

		setView();
		getUserPos('letter');
		interactiveGPS = true;

		interactiveMap.removeAllAnnotations();
		addSpecificClueZone(1);
		displaySpecificMarkers(7, interactiveMap);
		getSpecificIconsForTrail(7, interactiveMap);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten startad");
	}
}

function setView() {
	try {
		setLabelText();
		$.letterView.show();
		$.letterView.height = Ti.UI.SIZE;
		
		$.lettersView.show();
		$.lettersView.height = Ti.UI.SIZE;
		
		$.hideView.hide();
		$.hideView.height = 0;

		 $.clueSlideView.height = Ti.UI.SIZE;
		 $.clueSlideView.show();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - set view");
	}
}

function setLabelText() {
	try {
		var found = fetchFoundLettersCol();
		$.lblCollectedLetters.text = 'Bokstäver: ';

		for (var i = 0; i < found.length; i++) {
			$.lblCollectedLetters.text += found[i].letter;

			if (found[i].id == 9) {
				
				$.letterView.hide();
				$.letterView.height = '0%';
				
				$.wordView.show();
				$.wordView.height = Ti.UI.SIZE;
 
				 $.lblScroll.hide();
				 $.lblScroll.height = 0;
				 $.clueSlideView.height = 0;
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - set labeltext");
	}
}

function checkIfStarted() {
	try {
		var started = fetchFoundLettersCol();
		Ti.API.info("started" + JSON.stringify(started));
		var next_id = started.length;
		Ti.API.info("next_id" + JSON.stringify(next_id));
		
		
		if (next_id > 0 && next_id < 9) {
			setView();
			foundLetterId = next_id + 1;
			$.slides.currentPage = foundLetterId-1;

			interactiveMap.removeAllAnnotations();
			displaySpecificMarkers(7, interactiveMap);
			getSpecificIconsForTrail(7, interactiveMap);
			addSpecificClueZone(foundLetterId);
		} else if (started.length == 9) {
			setLabelText();
			setLastView();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - check if started");
	}
}

function setLastView() {

	// $.lettersView.show();
	// $.lettersView.height = Ti.UI.SIZE;
	// $.wordClue.show();
	// $.wordClue.height = Ti.UI.SIZE;
	// $.wordClueLbl.show();
	// $.wordClueLbl.height = Ti.UI.SIZE;
	// $.sendWord.show();
	// $.sendWord.height = '30dp';
	// $.lblCollectedLetters.show();
	// $.lblCollectedLetters.height = Ti.UI.SIZE;
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
function toNextClue() {
	try {
		var nextDialog = Ti.UI.createAlertDialog({
			message : 'Visa försvunnen bokstav?',
			buttonNames : ['Ja, visa!', 'Stäng']
		});

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var lost = fetchOneLetter(foundLetterId);
				lostLetter = lost[0].letter;
				lostId = lost[0].id;

				$.txtLetter.value = '';
				$.txtLetter.value = lostLetter;
			}
		});

		nextDialog.show();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - to next clue");
	}
}

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var toSend = letter.toUpperCase();
		checkLetter(toSend);
		$.txtLetter.value = '';
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - send letter");
	}
}

//-----------------------------------------------------------
// Validerar bokstaven som skrivits in, sätter found till
// 1 i letterModel och läser upp nästa ledtråd
//-----------------------------------------------------------
function checkLetter(letterToCheck) {
	try {
		var messageDialog = Ti.UI.createAlertDialog();
		var fetchLetter = fetchOneLetter(foundLetterId);
		var correctLetter = fetchLetter[0].letter;

		if (letterToCheck.length > 1) {
			messageDialog.message = "Man får bara skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['OK'];

			messageDialog.show();
		} else if (letterToCheck.length < 1 && letterToCheck.length == " ") {
			messageDialog.message = "Man måste skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['OK'];

			messageDialog.show();
		} else if (letterToCheck != correctLetter) {
			messageDialog.message = "Är du säker på att " + letterToCheck + ' var rätt bokstav för ledtråd ' + foundLetterId + '? Kontrollera att du inte gått förbi en bokstav.';
			messageDialog.title = 'Kontrollera bokstav';
			messageDialog.buttonNames = ['OK'];

			messageDialog.show();
		} else {

			var unFound = fetchUnFoundLettersCol();

			if (unFound.length > 0) {
				setLetterOne(unFound[0].id);
				foundLetterId++;
				setLabelText();

				removeClueZones();
				$.slides.currentPage = unFound[0].id;
				addSpecificClueZone(foundLetterId);
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - check letter");
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	try {
		var check = $.txtWord.value;
		var bigword = check.toUpperCase();
		var checkword = bigword.split(" ", 1);

		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames : ['Stäng'],
			title : "Fel ord"
		});

		if (checkword == word) {
			removeClueZones();

			$.sendWord.hide();
			$.sendWord.height = 0;
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.wordClue.hide();
			$.wordClue.height = 0;
			$.wordClueLbl.hide();
			$.wordClueLbl.height = 0;

			$.lblCollectedLetters.text = 'Bra jobbat! Du hittade det rätta ordet!';
			$.lblCollectedLetters.fontFamily = 'Raleway-Medium';
			$.lblCollectedLetters.fontSize = '16dp';

			Alloy.Globals.stopGame();
			startOver();
			interactiveGPS = false;
		} else {
			alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			alertDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - check word");
	}
}

//-----------------------------------------------------------
// Eventlistener för att rensa de funna bokstäverna när appen stängs
//-----------------------------------------------------------
Titanium.App.addEventListener('destroy', function() {
	Alloy.Globals.stopGame();
	startOver();
});

//-----------------------------------------------------------
// Sparar till found 0 och tömmer bokstäverna så man kan spela igen
//-----------------------------------------------------------
function startOver() {
	try {
		var col = fetchFoundLettersCol();

		for (var i = 0; i < col.length; i++) {;
			setLetterZero(col[i].id);

			Ti.API.info(JSON.stringify(col[i].letter));
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	}
}

var cleanup = function() {
	stopGPS();
	$.destroy();
	$.off();
	$.interactiveWindow = null;
};

$.interactiveWindow.addEventListener('close', cleanup);
