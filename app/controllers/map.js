Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/SQL.js");

var menuOpen = false;

var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var trailsCollection = getTrailsCollection();

Ti.API.info('map controller skapas');

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
		$.mapView.add(showMap(map));
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

// //-----------------------------------------------------------
// // Öppnar hotspotDetail med info om vald hotspot
// //-----------------------------------------------------------
// function showHotspot(name) {
	// try {
		// hotspotCollection.fetch({
			// query : getHotspotByName + name + '"'
		// });
// 
		// var jsonObjHot = hotspotCollection.toJSON();
// 
		// var hotspotTxt = {
			// title : name,
			// infoTxt : jsonObjHot[0].infoTxt,
			// id : jsonObjHot[0].id
		// };
// 
		// var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		// Alloy.CFG.tabs.activeTab.open(hotspotDetail);
	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	// }
// }

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
map.addEventListener('click', function(evt) {
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
map.addEventListener('singletap', function() {
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

