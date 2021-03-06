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
			if (evt.clicksource == 'rightPane') {
				showHotspot(evt.annotation.id);
			}
		});
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - display map");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(name) {
	try {
		var jsonObjHot = returnSpecificHotspotsByName(name);

		var hotspotTxt = {
			title : name,
			titleEng : jsonObjHot[0].engelsk_titel,
			infoTxt : jsonObjHot[0].infoTxt,
			infoTxtEng : jsonObjHot[0].engelsk_beskrivning,
			id : jsonObjHot[0].id,
			x : jsonObjHot[0].xkoord,
			y : jsonObjHot[0].ykoord
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView().open();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactiv - showHotspot");
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
				color : '#FCAF17',
				font : {
					fontSize : '16dp',
					fontFamily : 'Raleway-Medium'
				}
			});

			var clueTxt = Ti.UI.createLabel({
				top : '2dp',
				color : 'black',
				font : {
					fontSize : '14dp',
					fontFamily : 'Raleway-Light'
				}
			});
			
			if(language == 'svenska'){
				clueTitle.text = 'Ledtråd ' + (i + 1);
				clueTxt.text = letterJSON[i].clue;
			} else {
				clueTitle.text = 'Clue ' + (i + 1);
				clueTxt.text = letterJSON[i].clue_eng;
			}

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
			color : 'black',
			font : {
				fontSize : '14dp',
				fontFamily : 'Raleway-Light'
			}
		});
		
		if(language == 'svenska'){
			infoTxt.text = 'Swipa åt sidan för att se nästa ledtråd';
		} else {
			infoTxt.text = 'Swipe to the side to see the next clue';
		}
		
		$.slides.add(infoTxt);
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Interactive - set interactive views");
	}
}

//-----------------------------------------------------------
// Kickar igång spelet/jakten
//-----------------------------------------------------------
function startInteractive() {
	try {
		if (!Ti.Geolocation.locationServicesEnabled) {
			var alertDialog = Ti.UI.createAlertDialog({
				buttonNames : ['OK']
			});
			
			if(language == 'svenska'){
				alertDialog.title = 'Påminnelser';
				alertDialog.message = 'Tillåt appen att se din position för att kunna få påminnelser när du närmar dig en bokstav! Gå in på platstjänster i dina inställningar.';
			} else {
				alertDialog.title = 'Reminders';
				alertDialog.message = 'Allow the app to see your position in order to get reminders when you approach a letter! Go to Location Services in your settings.';
			}
			
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
		$.lblCollectedLetters.text = String.format(L('foundLetters_lbl'), '');

		for (var i = 0; i < found.length; i++) {
			$.lblCollectedLetters.text += found[i].letter;

			if (found[i].id == 9) {
				
				$.letterView.hide();
				$.letterView.height = '0%';
				
				$.wordView.show();
				$.wordView.height = Ti.UI.SIZE;
 
				// $.lblScroll.hide();
				// $.lblScroll.height = 0;
				$.clueSlideView.height = 0;
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - set labeltext");
	}
}

function checkIfStarted() {
	try {
		var next_id = fetchFoundLettersCol();
		
		if (next_id.length > 0 && next_id.length < 9) {
			setView();
			foundLetterId = next_id.length + 1;
			$.slides.setCurrentPage = foundLetterId;

			interactiveMap.removeAllAnnotations();
			displaySpecificMarkers(7, interactiveMap);
			getSpecificIconsForTrail(7, interactiveMap);
			addSpecificClueZone(foundLetterId);
		} else if (next_id.length == 9) {
			setLabelText();
			setLastView();
		} 
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Bokstavsjakten - check if started");
	}
}

function setLastView() {
	$.lettersView.show();
	$.lettersView.height = Ti.UI.SIZE;
	$.wordClue.show();
	$.wordClue.height = Ti.UI.SIZE;
	$.wordClueLbl.show();
	$.wordClueLbl.height = Ti.UI.SIZE;
	$.sendWord.show();
	$.sendWord.height = '30dp';
	$.lblCollectedLetters.show();
	$.lblCollectedLetters.height = Ti.UI.SIZE;
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
function toNextClue() {
	try {
		var nextDialog = Ti.UI.createAlertDialog();
		
		if(language == 'svenska'){
			nextDialog.message = 'Visa försvunnen bokstav?';
			nextDialog.buttonNames = ['Ja, visa!', 'Stäng'];
		} else {
			nextDialog.message = 'Show missing letter?';
			nextDialog.buttonNames = ['Yes, show it!', 'Close'];
		}

		nextDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var lost = fetchOneLetter(foundLetterId);
				
				if (lost != null) {
					lostLetter = lost[0].letter;
					lostId = lost[0].id;

					$.txtLetter.value = '';
					$.txtLetter.value = lostLetter;
				} else {
					var errorDialog = Ti.UI.createAlertDialog();
					
					if(language == 'svenska'){
						errorDialog.message = 'Du har redan hittat alla bokstäver. Starta om appen och testa igen!';
						errorDialog.buttonNames = ['Stäng'];
					} else {
						errorDialog.message = 'You have already found all the letters. Restart the app and try again!';
						errorDialog.buttonNames = ['Close'];
					}

				}
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
		var messageDialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK']
		});
		var fetchLetter = fetchOneLetter(foundLetterId);
		var correctLetter = fetchLetter[0].letter;

		if (letterToCheck.length > 1) {
			if(language == 'svenska'){
				messageDialog.message = "Man får bara skriva in en bokstav.";
				messageDialog.title = 'Ojdå, nu blev det fel';
			} else {
				messageDialog.message = "You only get to send one letter.";
				messageDialog.title = 'Oops, something went wrong';
			}

			messageDialog.show();
		} else if (letterToCheck.length < 1 && letterToCheck.length == " ") {
			if(language == 'svenska'){
				messageDialog.message = "Man måste skriva in en bokstav.";
				messageDialog.title = 'Ojdå, nu blev det fel';
			} else {
				messageDialog.message = "You have to send one letter.";
				messageDialog.title = 'Oops, something went wrong';
			}

			messageDialog.show();
		} else if (letterToCheck != correctLetter) {
			if(language == 'svenska'){
				messageDialog.message = 'Är du säker på att ' + letterToCheck + ' var rätt bokstav för ledtråd ' + foundLetterId + '? Kontrollera att du inte gått förbi en bokstav.';
				messageDialog.title = 'Ojdå, nu blev det fel';
			} else {
				messageDialog.message = 'Are you sure that ' + letterToCheck + ' was the correct letter? Check that you have not walked past the letter.';
				messageDialog.title = 'Oops, something went wrong';
			}

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

		var alertDialog = Ti.UI.createAlertDialog();

		if(language == 'svenska'){
			alertDialog.buttonNames = ['Stäng'];
			alertDialog.title = "Fel ord";
		} else {
			alertDialog.buttonNames = ['Close'];
			alertDialog.title = "Wrong word";
		}
		
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

			if(language == 'svenska'){
				$.lblCollectedLetters.text = 'Bra jobbat! Du hittade det rätta ordet!';
			} else {
				$.lblCollectedLetters.text = 'Good job! You found the right word!';
			}
			
			$.lblCollectedLetters.fontFamily = 'Raleway-Medium';
			$.lblCollectedLetters.fontSize = '16dp';

			Alloy.Globals.stopGame();
			startOver();
			interactiveGPS = false;
		} else {
			if(language == 'svenska'){
				alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			} else {
				alertDialog.message = "Try again! You will soon figure it out!";
			}
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
		}
		
		foundLetterId = 1;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	}
}

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {	
	$.off();
	interactiveMap.removeEventListener('click', evtList);
	interactiveMap.removeAllAnnotations();
};

var back = function(){
	$.interactiveWindow.close();
	cleanup();
};

$.interactiveWindow.addEventListener('androidback', back);


