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
// Variabel för kartvyn
//-----------------------------------------------------------

var MapModule = require('ti.map');
Alloy.Globals.MapModule = MapModule;

bigMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	userLocation : true,
	height : '100%',
	width : Ti.UI.FILL
});
detailMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	userLocation : true,
	height : '100%',
	width : Ti.UI.FILL
});
interactiveMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	userLocation : true,
	height : '100%',
	width : Ti.UI.FILL
});

//-----------------------------------------------------------
// Globala variabler för geofencing.
//-----------------------------------------------------------
var gLat = 0;
var gLon = 0;
var lat = null;
var lon = null;
var foundId = 12;
var nextId = 1;
var notify = true;
var myPosition = false;

//-----------------------------------------------------------
// Array som håller bokstäverna från bokstavsjakten.
//-----------------------------------------------------------
var lettersArray = [];
var infospotArray = [];
var markerHotspotArray = [];
var globalTrailID = 0;
var word = 'ÖRONMANET';

var interactiveVisible = false;

var hotspotGPS = false;
var interactiveGPS = false;

var farjelage = false;
var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;

//-----------------------------------------------------------
// Variabel för kartvyn
//-----------------------------------------------------------

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

//-----------------------------------------------------------
// Avsluta GPS när man stänger appen
//-----------------------------------------------------------
// Titanium.App.addEventListener('destroy', function() {
// 
	// gLat = null;
	// gLon = null;
// 
	// if (interactiveGPS) {
		// Alloy.Globals.stopGame();
	// }
	// if (hotspotGPS) {
		// Alloy.Globals.stopGPS();
	// }
// });
// Titanium.App.addEventListener('close', function() {
// 
	// Ti.API.info('App close');
// 
	// if (interactiveGPS) {
		// Alloy.Globals.stopGame();
	// }
	// if (hotspotGPS) {
		// Alloy.Globals.stopGPS();
	// }
// });
// 
// Titanium.App.addEventListener('stop', function() {//??
// 
	// Ti.API.info('App stop');
// 
	// if (interactiveGPS) {
		// Alloy.Globals.getUserPos('letter');
	// }
	// if (hotspotGPS) {
		// Alloy.Globals.getUserPos('hotspot');
	// }
// });




// var activity = Ti.Android.currentActivity;
// ['create', 'destroy', 'pause', 'resume', 'start', 'stop'].forEach(function(e) {
	// activity.addEventListener(e, function() {
// 
		// if (e == 'destroy') {
			// Ti.API.info('SANDRA :::: destroy');
// 
			// if (interactiveGPS) {
				// Alloy.Globals.stopGame();
			// }
			// if (hotspotGPS) {
				// Alloy.Globals.stopGPS();
			// }
		// }
// 		
		// if (e == 'close') {
			// Ti.API.info('SANDRA :::: close');
// 
			// if (interactiveGPS) {
				// Alloy.Globals.stopGame();
			// }
			// if (hotspotGPS) {
				// Alloy.Globals.stopGPS();
			// }
		// }
// 
	// });
// });

