Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

var args = arguments[0] || {};

var menuDetailVisible = false;

//-----------------------------------------------------------
// args från annan controller
//-----------------------------------------------------------
var trailName = args.title;
var trailColor = args.color;
var trailId = args.id;
var zoomLat = args.zoomlat;
var zoomLon = args.zoomlon;

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
detailMap.removeAllAnnotations();
showMapDetail();
getSpecificIconsForTrail(trailId, detailMap);
displaySpecificMarkers(trailId, detailMap);

if(hotspotGPS){
	$.geoSwitch1.value = true;
}

//-----------------------------------------------------------
// Functioner för att öppna och fylla kartan
//-----------------------------------------------------------
function showMapDetail(){
	try{
		$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}	
}

//-----------------------------------------------------------
// Switch för att aktivera location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitch1.addEventListener('change', function(e) {
	if ($.geoSwitch1.value == true) {
		getUserPos('hotspot');
		hotspotGPS = true;
	}
	if($.geoSwitch1.value == false){
		Alloy.Globals.stopGPS();
		hotspotGPS = false;
	}
});

// //-----------------------------------------------------------
// // Switch för att visa hotspots på kartan
// //-----------------------------------------------------------
// function disHot(){
	// if ($.HotSwitch1.value == true) {
		// removeSpecHotspot();
		// displaySpecificMarkers(trailId, detailMap);
		// detailMap.addEventListener('click', evtList);	
	// } else {
		// detailMap.removeEventListener('click', evtList);
		// removeSpecHotspot();
	// }
// }

//-----------------------------------------------------------
// Funktioner för att visa och stänga kartmenyn 
//-----------------------------------------------------------
function showMenu() {
	try {
		if(!menuDetailVisible){
			showDetailMenu();
			menuDetailVisible = true;
			$.btnMenuDetail.backgroundImage = '/images/closeBurger.png';
		}else {
			closeDetailMenu();
			menuDetailVisible = false;
			$.btnMenuDetail.backgroundImage = '/images/hamburger.png';
		}		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
}
detailMap.addEventListener('singletap', function() {
	if(menuDetailVisible){
		closeDetailMenu();
		menuDetailVisible = false;
	}
});
function showDetailMenu(){
	$.widgetView.height = '80dp';
}
function closeDetailMenu(){
	$.widgetView.height = '0dp';
}

//-----------------------------------------------------------
// Eventlistener för klick på hotspot
//-----------------------------------------------------------
var evtLists = function(evt){
	try {
		if (evt.clicksource == 'rightPane') {
			showHotspot(evt.annotation.id);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartfunktioner");
	}	
};
detailMap.addEventListener('click', evtLists);

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
	$.destroy();
	$.off();
	$.detailwin = null;
	detailMap.removeEventListener('click', evtList);
	detailMap.removeAllAnnotations();
};

$.detailwin.addEventListener('close', cleanup);