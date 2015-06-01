Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/SQL.js");

var menuOpen = false;

var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
try {
	displayBigMap();
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
}

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function displayBigMap() {
	try {
		Ti.API.info('innan kartan ');
		$.mapView.add(showMap(bigMap));
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}	
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myName) {
	try {
		trailsCollection.fetch({
			query : getTrailByName + myName + '"'
		});

		var jsonObjTr = trailsCollection.toJSON();

		var args = {
			id : jsonObjTr[0].id,
			title : myName,
			length : jsonObjTr[0].length,
			infoTxt : jsonObjTr[0].infoTxt,
			area : jsonObjTr[0].area,
			color : jsonObjTr[0].color,
			zoomlat : jsonObjTr[0].zoomLat,
			zoomlon : jsonObjTr[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		Alloy.CFG.tabs.activeTab.open(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
bigMap.addEventListener('click', evtListenMap);

//-----------------------------------------------------------
// Funktioner för att öppna och stänga kartmenyn
//-----------------------------------------------------------
bigMap.addEventListener('singletap', function() {
	closeMapMenu();
});

function openMenu() {
	if (!menuOpen) {
		$.widgetView.height = '30%';
		menuOpen = true;
	} else {
		closeMenu();
	}
}

function closeMenu() {
	$.widgetView.height = '0dp';
	menuOpen = false;
}

