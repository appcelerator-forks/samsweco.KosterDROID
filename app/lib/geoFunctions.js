//-----------------------------------------------------------
// Hämtar hotspotCollection
//-----------------------------------------------------------
var hotspotsModel = Alloy.Models.hotspotModel;

function returnHotspotsToAlert() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel WHERE alerted = 0'
	});

	return hotspotColl.toJSON();
}

function setHotspotAlerted(id) {
	hotspotsModel.fetch({
		'id' : id
	});

	hotspotsModel.set({
		'alerted' : 1
	});
	hotspotsModel.save();
}

function returnBoatHotspots() {
	var hotspotColl = Alloy.Collections.hotspotModel;
	hotspotColl.fetch({
		query : 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID = 8'
	});

	return hotspotColl.toJSON();
}

//-----------------------------------------------------------
// Hämtar letterCollection och letterModel
//-----------------------------------------------------------
var lettersModel = Alloy.Models.letterModel;

function setNoLetter(lid) {
	lettersModel.fetch({
		'id' : lid
	});

	lettersModel.set({
		'letter' : '-',
		'found' : 1
	});

	lettersModel.save();
	alerted = false;
	// foundLetterId++;

}

function setLetterOne(letterId, letter) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'letter' : letter,
		'found' : 1
	});
	lettersModel.save();
	alerted = false;
	//	lettersModel.destroy();
}

function setLetterZero(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'letter' : null,
		'found' : 0
	});
	lettersModel.save();
	//	lettersModel.destroy();
}

function getLength() {
	return fetchFoundLettersCol().length;
}

function setAlertedOne(letterId) {
	lettersModel.fetch({
		'id' : letterId
	});

	lettersModel.set({
		'alerted' : 1
	});
	lettersModel.save();
}

function fetchAllLetters() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();
	return letterCollection.toJSON();
}

function fetchFoundLettersCol() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 1'
	});
	return letterCollection.toJSON();
}

function fetchUnFoundLettersCol() {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE found = 0'
	});
	return letterCollection.toJSON();
}

function fetchOneLetter(lId) {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch({
		query : 'SELECT * FROM letterModel WHERE id =' + lId + '"'
	});
	return letterCollection.toJSON();
}

// var foundJSON = [];
// var alertedArray = [];
// var foundLetterId = 1;

// //-----------------------------------------------------------
// // Hämtar hotspotCollection
// //-----------------------------------------------------------
// var hotspotColl = Alloy.Collections.hotspotModel;
// hotspotColl.fetch();
// var hotspotJSONobj = hotspotColl.toJSON();
// // Alloy.Globals.hotspotJSONobj = hotspotJSONobj;
// 
// var boatHotspotColl = Alloy.Collections.hotspotModel;
// boatHotspotColl.fetch({
	// query : 'SELECT * FROM hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID = 8'
// });
// var boatTripHotspots = boatHotspotColl.toJSON();
// 
// //-----------------------------------------------------------
// // Hämtar letterCollection och letterModel
// //-----------------------------------------------------------
// var lettersModel = Alloy.Models.letterModel;
// var foundLettersModel = Alloy.Models.foundLettersModel;
// var letterCollection = Alloy.Collections.letterModel;
// letterCollection.fetch();
// var letterJSON = letterCollection.toJSON();

//-----------------------------------------------------------
// Hämtar användarens position och startar location-event
// för påminnelser om sevärdheter eller bokstavsjakt
//-----------------------------------------------------------
function getUserPos(type) {
	try {

		//Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
		Titanium.Geolocation.pauseLocationUpdateAutomatically = true;
		Titanium.Geolocation.distanceFilter = 3;

		if (type == 'hotspot') {
			Ti.Geolocation.addEventListener('location', addHotspotLocation);
		}

		if (type == 'letter') {
			Ti.Geolocation.addEventListener('location', addLetterLocation);
		}
		if (type == 'boat') {
			Ti.Geolocation.addEventListener('location', addBoatLocation);
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}

Alloy.Globals.getUserPos = getUserPos;

var addLetterLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'letter');
		currentLocationFinder();
	}
};

var addHotspotLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'hotspot');
	}
};

var addBoatLocation = function(e) {
	if (!e.error) {
		setUserPosition(e.coords, 'boat');
	}
};

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function setUserPosition(userCoordinates, type) {
	try {
		gLat = userCoordinates.latitude;
		gLon = userCoordinates.longitude;

		if (type == 'hotspot') {
			userIsNearHotspot();
		} else if (type == 'letter') {
			userIsNearLetter();
		} else if (type == 'boat') {
			userOnBoatTrip();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - getPosition");
	}
}

function currentLocationFinder() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		var currentRegion = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.002,
			longitudeDelta : 0.002
		};

		interactiveMap.setLocation(currentRegion);
	});
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceM(latt, lonn, GlobalLat, GlobalLon) {
	try {
		if (latt == null || lonn == null || GlobalLat == null || GlobalLon == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GlobalLat - latt) * Math.PI / 180) / 2 + Math.cos(latt * Math.PI / 180) * Math.cos(GlobalLat * Math.PI / 180) * (1 - Math.cos((GlobalLon - lonn) * Math.PI / 180)) / 2;
		var distanceInM = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distanceInM;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(latti, lonni, rad) {
	try {

		var inside = false;
		var distance = distanceM(latti, lonni, gLat, gLon);

		if (distance <= rad) {
			inside = true;
		}
		return inside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearHotspot() {
	// try {
		// for (var h = 0; h < hotspotJSONobj.length; h++) {
			// if (hotspotJSONobj[h].alerted == 0) {
// 
				// var hotlat = hotspotJSONobj[h].xkoord;
				// var hotlon = hotspotJSONobj[h].ykoord;
				// var radius = hotspotJSONobj[h].radie;
// 
				// if (isInsideRadius(hotlat, hotlon, radius)) {
					// var dialog = Ti.UI.createAlertDialog({
						// message : 'Nu börjar du närma dig ' + hotspotJSONobj[h].name + '!',
						// buttonNames : ['Läs mer', 'Stäng']
					// });
// 
					// var hottitle = hotspotJSONobj[h].name;
					// var infoText = hotspotJSONobj[h].infoTxt;
					// var hotid = hotspotJSONobj[h].id;
// 
					// dialog.addEventListener('click', function(e) {
						// if (e.index == 0) {
							// var hotspotTxt = {
								// title : hottitle,
								// infoTxt : infoText,
								// id : hotid
							// };
// 
							// var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
							// Alloy.CFG.tabs.activeTab.open(hotspotDetails);
						// }
					// });
// 
					// hotspotJSONobj[h].alerted = 1;
					// dialog.show();
					// playSound();
				// }
			// }
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	// }


	try {
		var hotspotsToLoop = returnHotspotsToAlert();

		for (var h = 0; h < hotspotsToLoop.length; h++) {
			if (hotspotsToLoop[h].alerted == 0) {
				var hotlat = hotspotsToLoop[h].xkoord;
				var hotlon = hotspotsToLoop[h].ykoord;
				var radius = hotspotsToLoop[h].radie;

				if (isInsideRadius(hotlat, hotlon, radius)) {
					alertOnHotspot(hotspotsToLoop[h].name, hotspotsToLoop[h].infoTxt, hotspotsToLoop[h].id);
					setHotspotAlerted(hotspotsToLoop[h].id);
				}
			}

		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - nearHotspot");
	}

}

//-----------------------------------------------------------
// På båtturen : kontrollerar om enheten är innanför en radie
// för en sevärdhet, sänder ut dialog om true
//-----------------------------------------------------------
function userOnBoatTrip() {
	// try {
		// var boatdialog = Ti.UI.createAlertDialog({
			// buttonNames : ['Läs mer', 'Stäng']
		// });
// 
		// for (var b = 0; b < boatTripHotspots.length; b++) {
			// if (boatTripHotspots[b].alerted == 0) {
// 
				// var blat = boatTripHotspots[b].xkoord;
				// var blon = boatTripHotspots[b].ykoord;
				// var bradius = boatTripHotspots[b].radie;
// 
				// if (isInsideRadius(blat, blon, bradius)) {
					// boatdialog.message = 'Nu börjar du närma dig ' + boatTripHotspots[b].name + '!';
// 
					// var htitle = boatTripHotspots[b].name;
					// var iText = boatTripHotspots[b].infoTxt;
					// var boatid = boatTripHotspots[b].id;
// 
					// boatdialog.addEventListener('click', function(e) {
						// if (e.index == 0) {
							// var hotspotTxt = {
								// title : htitle,
								// infoTxt : iText,
								// id : boatid
							// };
// 
							// var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
							// Alloy.CFG.tabs.activeTab.open(hotspotDetails);
						// }
					// });
// 
					// boatdialog.show();
					// playSound();
					// boatTripHotspots[b].alerted = 1;
// 
					// alertedArray.push(boatTripHotspots[b].name);
					// if (alertedArray.length == 8) {
						// Alloy.Globals.stopBoatGPS();
					// }
				// }
			// }
		// }
// 
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isNearPoint");
	// }
	
	try {
		var boatdialog = Ti.UI.createAlertDialog({
			buttonNames : ['Läs mer', 'Stäng']
		});

		var boatHotspots = returnBoatHotspots();

		for (var b = 0; b < boatHotspots.length; b++) {
			if (boatHotspots[b].alerted == 0) {

				var blat = boatHotspots[b].xkoord;
				var blon = boatHotspots[b].ykoord;
				var bradius = boatHotspots[b].radie;

				if (isInsideRadius(blat, blon, bradius)) {
					alertOnHotspot(boatHotspots[b].name, boatHotspots[b].infoTxt, boatHotspots[b].id);
					boatHotspots[b].alerted = 1;

					alertedArray.push(boatTripHotspots[b].name);
					if (alertedArray.length == 8) {
						Alloy.Globals.stopBoatGPS();
					}
				}
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - nearBoatspot");
	}
	
}

function alertOnHotspot(hottitle, infoText, hotid) {
	try {
		var dialog = Ti.UI.createAlertDialog({
			message : 'Nu börjar du närma dig ' + hottitle + '!',
			buttonNames : ['Läs mer', 'Stäng']
		});

		dialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				var hotspotTxt = {
					title : hottitle,
					infoTxt : infoText,
					id : hotid
				};

				var hotspotDetails = Alloy.createController("hotspotDetail", hotspotTxt).getView();
				Alloy.CFG.tabs.activeTab.open(hotspotDetails);
			}
		});

		dialog.show();
		playSound();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - alerthot");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en radie för en bokstav,
// sänder ut dialog om true
//-----------------------------------------------------------
function userIsNearLetter() {
	// try {
		// for (var isnear = 0; isnear < Alloy.Globals.jsonCollection.length; isnear++) {
			// if (Alloy.Globals.jsonCollection[isnear].alerted == 0) {
				// if (Alloy.Globals.jsonCollection[isnear].found == 0) {
// 
					// var lat = Alloy.Globals.jsonCollection[isnear].latitude;
					// var lon = Alloy.Globals.jsonCollection[isnear].longitude;
					// var letterradius = Alloy.Globals.jsonCollection[isnear].radius;
// 
					// if (isInsideRadius(lat, lon, letterradius)) {
						// var letterId = Alloy.Globals.jsonCollection[isnear].id;
// 
						// if (letterId == foundLetterId) {
							// alertLetter(Alloy.Globals.jsonCollection[isnear].clue);
							// Alloy.Globals.jsonCollection[isnear].alerted = 1;
						// } else {
							// checkIfRight(letterId);
						// }
					// }
				// }
			// }
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	// }
	
	try {
		var col = fetchUnFoundLettersCol();
		for (var p = 0; p < col.length; p++) {
			if (col[p].alerted == 0 && col[p].found == 0) {

				var lat = col[p].latitude;
				var lon = col[p].longitude;
				var letterradius = col[p].radius;

				if (isInsideRadius(lat, lon, letterradius)) {
					var letterId = col[p].id;
					var letterclue = col[p].clue;

					alertLetter(letterclue, letterId);
					setAlertedOne(letterId);

					// if (letterId == foundLetterId) {
						// alertLetter(letterclue, letterId);
						// setAlertedOne(letterId);
					// } 
					// else {
						// // checkIfRight(letterId);
						// if (!alerted) {
// 							
							// var letteralert = Ti.UI.createAlertDialog({
								// title : 'Har du missat en bokstav?',
								// message : 'Du kanske har missat en bokstav? Gå tillbaka eller tryck ifatt ledtrådarna till rätt nummer.',
								// buttonNames : ['Gå tillbaka och hitta förra', 'Stäng']
							// });
// 							
							// letteralert.addEventListener('click', function(evt){
								// if(evt.index == 1){
									// alertLetter(letterclue);
									// setAlertedOne(letterId);
								// }
							// });
// 							
							// letteralert.show();
							// // col[p].alerted == 1;
							// alerted = true;
						// }
					// }
				}
			}
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'isNearPoint - letter');
	}
	
}

function alertLetter(clue, id) {
	var message = Ti.UI.createAlertDialog({
		title : 'Du närmar dig bokstav nummer ' + id + '!',
		buttonNames : ['Gå till bokstavsjakten', 'Stäng'],
		message : 'Ledtråd: ' + clue
	});

	message.addEventListener('click', function(e) {
		if (e.index == 0) {
			Alloy.CFG.tabs.setActiveTab(3);
		}
	});
	message.show();
	playSound();
}

//-----------------------------------------------------------
// Kontrollerar om användaren har missat någon bokstav
//-----------------------------------------------------------
// function checkIfRight(lId) {
	// try {
		// var diff = id - foundLetterId;
// 
		// var wrongmessage = Ti.UI.createAlertDialog({
			// title : 'Ojdå!'
		// });
// 
		// if (diff == 1) {
			// foundLetterId++;
			// wrongmessage.buttonNames = ['Gå tillbaka och leta', 'Fortsätt leta efter nästa'];
			// wrongmessage.message = 'Du har nu missat en bokstav. Vill du gå tillbaka och leta efter den du missat eller fortsätta leta efter nästa bokstav?';
// 
			// wrongmessage.addEventListener('click', function(e) {
				// if (e.index == 1) {
					// foundLettersModel.fetch({
						// 'id' : (foundJSON.length + 1)
					// });
// 
					// foundLettersModel.set({
						// 'letter' : '-',
						// 'found' : 1
					// });
// 
					// foundLettersModel.save();
				// }
			// });
// 
			// Alloy.Globals.loadClue(foundLetterId);
			// alertLetter(Alloy.Globals.jsonCollection[foundLetterId].clue);
			// Alloy.Globals.jsonCollection[id].alerted = 1;
			// wrongmessage.show();
			// playSound();
// 
		// } else if (diff > 1) {
			// foundLetterId += diff;
			// wrongmessage.buttonNames = ['Gå tillbaka och hitta de andra', 'Fortsätt leta efter nästa'];
			// wrongmessage.message = 'Du har nu missat flera bokstäver. Vill du gå tillbaka och leta efter de du missat eller fortsätta leta efter nästa bokstav?';
// 
			// wrongmessage.addEventListener('click', function(e) {
				// if (e.index == 1) {
					// var letterIndex = foundJSON.length + 1;
// 
					// for (var i = 0; i < diff; i++) {
						// foundLettersModel.fetch({
							// 'id' : letterIndex
						// });
// 
						// foundLettersModel.set({
							// 'letter' : '-',
							// 'found' : 1
						// });
// 
						// foundLettersModel.save();
						// letterIndex++;
					// }
				// }
			// });
// 
			// alertLetter(Alloy.Globals.jsonCollection[foundLetterId].clue);
			// Alloy.Globals.jsonCollection[id].alerted = 1;
			// Alloy.Globals.loadClue(foundLetterId);
			// wrongmessage.show();
			// playSound();
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - playsound');
	// }
// 
	// try {
		// letId = lId;
		// var dif = (lId - foundLetterId);
// 
		// for (var i = 0; i < dif; i++) {
			// setNoLetter(lId);
			// lId++;
		// }
// 
		// Alloy.Globals.loadClue(foundLetterId + dif);
		// alertLetter(lId.clue);
		// setAlertedOne(lId);
		// //	var clue = fetchOneLetter(lId);
		// // alertLetter(clue[0].clue);
		// playSound();
// 
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - wrong');
	// }
// 
// 
// }

//-----------------------------------------------------------
// Spelar upp ett ljud när man får en påminnelse
//-----------------------------------------------------------
function playSound() {
	try {
		var player = Ti.Media.createSound({
			url : "/sound/popcorn.m4a"
		});

		player.play();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", 'geofunctions - playsound');
	}
}

//-----------------------------------------------------------
// Lägger till de gröna plupparna på bokstavsjakt-kartan
//-----------------------------------------------------------
function addClueZone() {
	// try {
		// for (var c = 0; c < Alloy.Globals.jsonCollection.length; c++) {
			// var zoneAnnotation = MapModule.createAnnotation({
				// latitude : Alloy.Globals.jsonCollection[c].latitude,
				// longitude : Alloy.Globals.jsonCollection[c].longitude,
				// image : '/pics/' + (c + 1) + 'green.png'
			// });
// 
			// interactiveMap.addAnnotation(zoneAnnotation);
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	// }

try {
		var zoneJSON = fetchAllLetters();

		for (var c = 0; c < zoneJSON.length; c++) {
			var zoneAnnotation = MapModule.createAnnotation({
				latitude : zoneJSON[c].latitude,
				longitude : zoneJSON[c].longitude,
				image : '/pins/' + (c + 1) + 'green.png'
			});

			interactiveMap.addAnnotation(zoneAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}

}

function addSpecificClueZone(id) {
	try {
		var zoneColl = fetchAllLetters();
		var letterZone = zoneColl[id - 1];

		var clueAnnotation = MapModule.createAnnotation({
			latitude : letterZone.latitude,
			longitude : letterZone.longitude,
			image : '/pins/' + id + 'green.png'
		});

		interactiveMap.addAnnotation(clueAnnotation);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - addClueZone");
	}
}

//-----------------------------------------------------------
// Push'ar in funna bokstäver i en array
//-----------------------------------------------------------
// function getFound() {
	// try {
		// foundJSON = [];
// 
		// var foundLettersCollection = Alloy.Collections.foundLettersModel;
		// foundLettersCollection.fetch({
			// query : 'SELECT letter FROM foundLettersModel WHERE found = 1'
		// });
// 
		// foundLetters = foundLettersCollection.toJSON();
		// for (var f = 0; f < foundLetters.length; f++) {
			// foundJSON.push(' ' + foundLetters[f].letter);
		// }
// 
		// return foundJSON;
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - getFound");
	// }
// }

//-----------------------------------------------------------
// Sparar till found 0 och tömmer bokstäverna så man kan spela igen
//-----------------------------------------------------------
function startOver() {
	// try {
		// for (var lid = 0; lid < foundJSON.length; lid++) {
			// var letterid = lid + 1;
// 
			// foundLettersModel.fetch({
				// 'id' : letterid
			// });
// 
			// foundLettersModel.set({
				// 'letter' : null,
				// 'found' : 0
			// });
// 
			// foundLettersModel.save();
		// }
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	// }

var col = fetchAllLetters();
	try {
		for (var i = 0; i < col.length; i++) {;
			setLetterZero(col[i].id);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - startOver");
	}


}

Alloy.Globals.startOver = startOver;

//-----------------------------------------------------------
// Sätter rätt region på karta utifrån var användaren befinner sig
//-----------------------------------------------------------
function getPosition(maptype) {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.coords != null) {
			maptype.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.007,
				longitudeDelta : 0.007
			};
			maptype.animate = true;
		}
	});
}

//-----------------------------------------------------------
// Avbryter location-event
//-----------------------------------------------------------
function stopGPS() {
	Titanium.Geolocation.removeEventListener('location', addHotspotLocation);
}

function stopGame() {
	Titanium.Geolocation.removeEventListener('location', addLetterLocation);
	startOver();
	// foundLettersModel.destroy();
}

function stopBoatGPS() {
	Titanium.Geolocation.removeEventListener('location', addBoatLocation);
}

Alloy.Globals.stopBoatGPS = stopBoatGPS;
Alloy.Globals.stopGPS = stopGPS;
Alloy.Globals.stopGame = stopGame;
