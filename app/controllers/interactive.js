var args = arguments[0] || {};
var radius = 20;

showMap();
createMapRoute();
var familyMap;
displayTrailMarkers();
addClueZone();

var letterCollection = getLetterCollection();

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	var check = $.word.value;
	check.toLowerCase();

	if (check == word) {
		alert("Bra jobbat!");
	} else {
		alert("Nej du, nu blev det fel...");
	}
}

//-----------------------------------------
// Zoomar in kartan på äventyrsleden
//-----------------------------------------
function showMap() {
	try {
		familyMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.HYBRID_TYPE,
			animate : true,
			height : '100%',
			width : Ti.UI.FILL
		});
		$.showFamilyTrail.add(familyMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - showMap");
	}
}

//-----------------------------------------------------------
// Beräknar nivån av inzoomning på en vald led
//-----------------------------------------------------------
function calculateMapRegion(trailCoordinates) {
	try {
		if (trailCoordinates.length != 0) {
			var poiCenter = {};
			var delta = 0.02;
			var minLat = trailCoordinates[0].latitude,
			    maxLat = trailCoordinates[0].latitude,
			    minLon = trailCoordinates[0].longitude,
			    maxLon = trailCoordinates[0].longitude;
			for (var i = 0; i < trailCoordinates.length - 1; i++) {
				minLat = Math.min(trailCoordinates[i + 1].latitude, minLat);
				maxLat = Math.max(trailCoordinates[i + 1].latitude, maxLat);
				minLon = Math.min(trailCoordinates[i + 1].longitude, minLon);
				maxLon = Math.max(trailCoordinates[i + 1].longitude, maxLon);
			}

			var deltaLat = maxLat - minLat;
			var deltaLon = maxLon - minLon;

			delta = Math.max(deltaLat, deltaLon);
			// Ändra om det ska vara mer zoomat
			delta = delta * 0.6;

			poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
			poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);

			region = {
				latitude : poiCenter.lat,
				longitude : poiCenter.lon,
				latitudeDelta : delta,
				longitudeDelta : delta

			};
		}
		return region;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - calculateMapRegion");
	}

}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoute() {
	try {
		var zoomedRoute = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/adventureroute.json").read().text;
		var parsedRoute = JSON.parse(zoomedRoute);

		var geoArray = [];
		geoArray.push(parsedRoute);

		var coordArray = [];

		for (var u = 0; u < geoArray.length; u++) {
			var coords = geoArray[0].features[0].geometry.paths[u];

			for (var i = 0; i < coords.length; i++) {

				var point = {
					latitude : coords[i][1],
					longitude : coords[i][0]
				};
				coordArray.push(point);
			}

			var route = {
				name : 'Äventyrsleden',
				points : coordArray,
				color : 'purple',
				width : 4.0
			};

			familyMap.addRoute(MapModule.createRoute(route));
		}

		familyMap.region = calculateMapRegion(coordArray);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - createMapRoute");
	}
}

//-----------------------------------------------------------
// Visar marker för vandringsleden
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		var markerAnnotation = MapModule.createAnnotation({
			latitude : 58.893198,
			longitude : 11.047852,
			title : 'Äventyrsleden',
			pincolor : MapModule.ANNOTATION_PURPLE,
			subtitle : 'Vandringsleden startar här!',
			font : {
				fontFamily : 'Gotham Rounded'
			}
		});

		familyMap.addAnnotation(markerAnnotation);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - displayTrailMarkers");
	}
}

function addClueZone() {
	var clueCollection = getLetterCollection();
	clueCollection.fetch({
		query : 'SELECT * FROM letterModel'
	});

	var jsonObjLetter = clueCollection.toJSON();

	for (var c = 0; c < jsonObjLetter.length; c++) {
		var markerAnnotation = MapModule.createAnnotation({
			id : 1,
			latitude : jsonObjLetter[c].latitude,
			longitude : jsonObjLetter[c].longitude
		});

		if (jsonObjLetter[c].found == 0) {
			markerAnnotation.image = '/images/red.png';
		} else {
			markerAnnotation.image = '/images/green.png';
		}

		familyMap.addAnnotation(markerAnnotation);
	}
}

function startInteractive() {
	getGPSpos();
	loadClue();
}

function loadClue() {
	$.btnStartQuiz.hide();
	$.txtLetter.show();
	$.lblLetters.show();
	$.lblCollectedLetters.show();

	if (foundId == !null) {
		letterCollection.fetch({
			query : 'SELECT * FROM letterModel where id = "' + foundId + '"'
		});

		var letterJSON = letterCollection.toJSON();

		$.lblWelcome.text = "Nästa ledtråd: ";
		$.lblInfoText.text = letterJSON[0].clue;

	} else {
		Ti.API.info("foundId är null");
	}
}

function sendLetter() {
	checkLetter(getLetter());
}

function getLetter() {
	var letter = $.txtLetter.value;
	//if (validate(letter)) {
	return letter.toUpperCase();
	//};
}

function checkLetter(letterToCheck) {
	var correctLetter = false;

	letterCollection.fetch({
		query : 'SELECT * FROM letterModel where id = "' + foundId + '"'
	});

	var letterJSON = letterCollection.toJSON();

	if (letterJSON[0].letter == letterToCheck) {
		lettersArray.push(letterJSON[0].letter);
		$.lblCollectedLetters.text + letterToCheck;

		//Sätta found till true!!
	} else {
		alert("Är du säker på att det var rätt bokstav?");
	}
}

//GEO STUFF
//------------------
//-------------------------------------

function getGPSpos() {
	try {

		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				alert('Get current position' + e.error);
			} else {
			}
		});

		if (Ti.Geolocation.locationServicesEnabled) {

			Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
			Titanium.Geolocation.distanceFilter = 10;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (e.error) {
					alert('Kan inte sätta eventListener ' + e.error);
				} else {
					getPosition(e.coords);
				}
			});
		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - get current position GPS");
	}

}

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj) {
	try {
		gLat = coordinatesObj.latitude;
		gLon = coordinatesObj.longitude;

		isNearPoint();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getPosition");
	}
}

//-----------------------------------------------------------
// Beräknar avståndet mellan enhetens koordinater och de punkter som håller info
//-----------------------------------------------------------
function distanceInM(lat1, lon1, GLat, GLon) {
	try {
		if (lat1 == null || lon1 == null || GLat == null || GLat == null) {
			alert("Det finns inga koordinater att titta efter");
		}

		var R = 6371;
		var a = 0.5 - Math.cos((GLat - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(GLat * Math.PI / 180) * (1 - Math.cos((GLon - lon1) * Math.PI / 180)) / 2;
		var distance = (R * 2 * Math.asin(Math.sqrt(a))) * 1000;

		return distance;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - distanceInM");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enhetens position är inom radien för en utsatt punkt
//-----------------------------------------------------------
function isInsideRadius(lat1, lon1, rad) {
	try {

		var isInside = false;
		var distance = distanceInM(lat1, lon1, gLat, gLon);

		if (distance <= rad) {
			isInside = true;
		}
		return isInside;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function isNearPoint() {
	try {
		var coordCollection = Alloy.Collections.letterModel;
		coordCollection.fetch();

		var jsonCollection = coordCollection.toJSON();

		for (var i = 0; i < jsonCollection.length; i++) {

			if (jsonCollection[i].found == 0) {
				var lat = jsonCollection[i].latitude;
				var lon = jsonCollection[i].longitude;

				if (isInsideRadius(lat, lon, radius)) {
					alert("Du är i punkt : " + jsonCollection[i].id + " och bokstaven är: " + jsonCollection[i].letter);
					foundId = jsonCollection[i].id;

					letterCollection.fetch({
						query : 'SELECT * FROM letterModel where id = "' + foundId + '"'
					});

					var letterJSON = letterCollection.toJSON();
					$.lblInfoText.text = letterJSON[0].clue;
					jsonCollection[i].found = 1;
				}
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - isNearPoint");
	}
}