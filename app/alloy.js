// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//-----------------------------------------------------------
// Globala variabler
//-----------------------------------------------------------
var gLat = 0;
var gLon = 0;
var foundId = 1;
var notify = true;
var alerted = false;

var lettersArray = [];
var word = 'RLT';
var globalTrailID = 0;

var interactiveVisible = false;

var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var wc = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;

var MapModule = require('ti.map');
var baseMap;

//-----------------------------------------------------------
// Metoder för alla collections
//-----------------------------------------------------------

function getHotspotCollection() {
	var hotspotCollection = Alloy.Collections.hotspotModel;
	return hotspotCollection;
}

function getMediaCollection() {
	var mediaCollection = Alloy.Collections.mediaModel;
	return mediaCollection;
}

function getTrailsCollection() {
	var trailCollection = Alloy.Collections.trailsModel;
	return trailCollection;
}

function getInfoCollection() {
	var infoCollection = Alloy.Collections.infoModel;
	return infoCollection;
}

function getJSONfiles() {
	var jsonFileCollection = Alloy.Collections.jsonFilesModel;
	return jsonFileCollection;
}

function getLetterCollection() {
	var letterCollection = Alloy.Collections.letterModel;
	return letterCollection;
}

function getInfoSpotCoordinatesCollection() {
	var infospotCollection = Alloy.Collections.infospotCoordinatesModel;
	return infospotCollection;
}

// var letterCollection = getLetterCollection();
// letterCollection.fetch();
//
// var jsonCollection = letterCollection.toJSON();
// Alloy.Globals.jsonCollection = jsonCollection;

//-----------------------------------------------------------
// Felhantering
//-----------------------------------------------------------
function newError(errorMsg, pageName) {
	try {
		var er = new Error(errorMsg);
		er.myObject = pageName;
		throw er;
	} catch (e) {

		alert("Error:[" + e.message + "] has occured on " + e.myObject + " page.");
	}
}

//SANDRA TA BORT SEN, BARA TEST

//GEO STUFF
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
function getGPSpos(type) {
	try {
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				//Ti.API.info('Get current position' + e.error);
				getGPSpos('interactive');
			}
		});

		if (Ti.Geolocation.locationServicesEnabled) {
		//	Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
			Titanium.Geolocation.manualMode = true;
			Titanium.Geolocation.distanceFilter = 3;
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS;
			Titanium.Geolocation.pauseLocationUpdateAutomatically = true;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (e.error) {
					Ti.API.info('Kan inte sätta eventListener ' + e.error);
					// Ti.Geolocation.getCurrentPosition(function(e) {
						// if (e.error) {
							// //Ti.API.info('Get current position' + e.error);
							// getGPSpos('interactive');
						// }
					// });
				} else {
					getPosition(e.coords, type);
					// $.coords.text = 'Lat: ' + JSON.stringify(e.coords.latitude + 'Lon: ' + JSON.stringify(e.coords.longitude));
				}
			});

		} else {
			alert('Tillåt gpsen, tack');
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - get current position GPS");
	}
}

Alloy.Globals.getGPSpos = getGPSpos;

//-----------------------------------------------------------
// Hämtar enhetens position och kontrollerar mot punkter
//-----------------------------------------------------------
function getPosition(coordinatesObj, type) {
	try {
		gLat = coordinatesObj.latitude;
		gLon = coordinatesObj.longitude;

		isNearPoint(type);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", " getPosition");
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - distanceInM");
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "geoFunctions - isInsideRadius");
	}
}

//-----------------------------------------------------------
// Kontrollerar om enheten är innanför en punkt, sänder ut dialog om true
//-----------------------------------------------------------
function isNearPoint(type) {
	var radius = 20;

	if (type == 'hotspot') {
		var hotspotColl = Alloy.Collections.hotspotModel;
		hotspotColl.fetch({
			query : 'SELECT DISTINCT id, name, infoTxt, xkoord, ykoord FROM hotspotModel'
		});

		var jsonHotspot = hotspotColl.toJSON();
		Ti.API.info('jsonhot : ' + JSON.stringify(jsonHotspot));

		for (var h = 0; h < jsonHotspot.length; h++) {

			var lat = jsonHotspot[h].xkoord;
			var lon = jsonHotspot[h].ykoord;

			if (isInsideRadius(lat, lon, radius)) {
				dialog.message = 'Nu börjar du närma dig ' + jsonHotspot[h].name + '!';
				dialog.buttonNames = ['Läs mer', 'Stäng'];

				dialog.addEventListener('click', function(e) {
					if (e.index == 0) {
						var hotspotTxt = {
							title : jsonHotspot[h].name,
							infoTxt : jsonHotspot[h].infoTxt,
							id : jsonHotspot[h].id
						};

						var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
						Alloy.CFG.tabs.activeTab.open(hotspotDetail);
					}
				});

				dialog.show();
			}
		}
	} else if (type == 'interactive') {

		for (var l = 0; l < Alloy.Globals.jsonCollection.length; l++) {
			if (Alloy.Globals.jsonCollection[l].found == 0) {
				var letterlati = Alloy.Globals.jsonCollection[l].latitude;
				var letterlongi = Alloy.Globals.jsonCollection[l].longitude;
				var letterradie = Alloy.Globals.jsonCollection[l].radie;

				if (isInsideRadius(letterlati, letterlongi, letterradie)) {

					var clue = Ti.UI.createNotification({
						message : "Ledtråd : " + Alloy.Globals.jsonCollection[l].clue,
						duration : Ti.UI.NOTIFICATION_DURATION_LONG
					});
					clue.show();

					Alloy.Globals.jsonCollection[l].found = 1;
					alerted = true;
					foundId = Alloy.Globals.jsonCollection[l].id;
					$.lblInfoText.text = Alloy.Globals.jsonCollection[l].clue;
				}
			}
		}
	}

	// for (var i = 0; i < Alloy.Globals.jsonCollection.length; i++) {
	//
	// if (Alloy.Globals.jsonCollection[i].found == 0) {
	// var lat = Alloy.Globals.jsonCollection[i].latitude;
	// var lon = Alloy.Globals.jsonCollection[i].longitude;
	//
	// if (isInsideRadius(lat, lon, radius)) {
	// var clue = Ti.UI.createNotification({
	// message : "Ledtråd : " + Alloy.Globals.jsonCollection[i].clue,
	// duration : Ti.UI.NOTIFICATION_DURATION_LONG
	// });
	// clue.show();
	// //Alloy.Globals.showInteractive(JSON.stringify(Alloy.Globals.jsonCollection[i].clue));
	// //alert("Du är i punkt : " + Alloy.Globals.jsonCollection[i].id + " och bokstaven är: " + Alloy.Globals.jsonCollection[i].letter);
	// foundId = Alloy.Globals.jsonCollection[i].id;
	//
	// $.lblInfoText.text = Alloy.Globals.jsonCollection[i].clue;
	// }
	// }
	// }
}

