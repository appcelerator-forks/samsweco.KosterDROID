// INNAN TAB
// $.koster.open();



// EFTER TAB

Ti.include('/geoFunctions.js');

$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;



//-----------------------------------------------------------
// Metoder för navigeringen
//-----------------------------------------------------------
// function toMap() {
	// try {
		// var mapWind = Alloy.createController('map').getView();
		// $.mapWin.add(mapWind);
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	// }
// }

function toInteractive() {
	try {
		var interactive = Alloy.createController('interactive').getView();
		$.interactiveWin.add(interactive);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

function toTrails() {
	try {
		var trails = Alloy.createController('trails').getView();
		$.hikeWin.add(trails);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

function toMore() {
	try {
		var more = Alloy.createController('more').getView();
		$.moreWin.add(more);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Förstasidan");
	}
}

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab.
//-----------------------------------------------------------
$.koster.addEventListener('blur', function(){
	$.koster = null;
});

$.hikeWin.addEventListener('blur', function(){
	$.hikeWin = null;
});

$.mapWin.addEventListener('blur', function(){
	$.mapWin = null;
});

$.moreWin.addEventListener('blur', function(){
	$.moreWin = null;
});

// $.interactiveWin.addEventListener('blur', function(){
	// $.interactiveWin = null;
// });

// $.infoWin.addEventListener('blur', function(){
	// $.infoWin = null;
// });


//-----------------------------------------------------------
// Öppnar kartmenyn
//-----------------------------------------------------------
function openMapMenu(){
	$.widgetView.height = '35%';
	menuOpen = true;
}
Alloy.Globals.openMapMenu = openMapMenu;

function closeMapMenu(){
	$.widgetView.height = '0dp';
	menuOpen = false;
}
Alloy.Globals.closeMapMenu = closeMapMenu;







//
//
//
//

Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

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
	try {
		var jsonObjTr = returnSpecificTrail(myName);

		var args = {
			id : jsonObjTr[0].id,
			title : myName,
			titleEng : jsonObjTr[0].name_eng,
			length : jsonObjTr[0].length,
			infoTxt : jsonObjTr[0].infoTxt,
			infoTxtEng : jsonObjTr[0].infoTxt_eng,
			area : jsonObjTr[0].area,
			color : jsonObjTr[0].color,
			zoomlat : jsonObjTr[0].zoomLat,
			zoomlon : jsonObjTr[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView().open();
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
var openDetailView = function(evt){
	if (evt.clicksource == 'rightPane') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else if (evt.annotation.name == 'trail') {
			showTrail(evt.annotation.id);
		}
	}
};

bigMap.addEventListener('click', openDetailView);

//-----------------------------------------------------------
// Funktioner för att öppna och stänga kartmenyn
//-----------------------------------------------------------
bigMap.addEventListener('singletap', function() {
	Alloy.Globals.openCloseMenu();
});

function openMenu() {
	if (!menuOpen) {
		Alloy.Globals.openMapMenu();
		$.btnMapMenu.backgroundImage = '/images/closeBurger.png';
	} else {
		Alloy.Globals.closeMapMenu();
		$.btnMapMenu.backgroundImage = '/images/hamburger.png';
	}
}

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 // var cleanup = function() {
 	// $.off();
	// bigMap.removeEventListener('click', openDetailView);
	// bigMap.removeAllAnnotations();
// };
// 
// var back = function(){
	// $.mapWindow.close();
	// cleanup();
// };
// 
// $.mapWindow.addEventListener('androidback', back);
// 



