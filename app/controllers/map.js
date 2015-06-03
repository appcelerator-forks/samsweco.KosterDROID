Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

var menuOpen = false;

var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
displayBigMap();

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function displayBigMap() {
	// try {
		$.mapView.add(showMap(bigMap));
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	// }	
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myName) {
	// try {
		var jsonObjTr = returnSpecificTrail(myName);

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
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	// }
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
bigMap.addEventListener('click', function(evt){
	if (evt.clicksource == 'rightPane') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else if (evt.annotation.name == 'trail') {
			showTrail(evt.annotation.id);
		}
	}
});

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

