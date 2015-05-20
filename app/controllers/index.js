Ti.include("/SQL.js");
Ti.include("/geoFunctions.js");

$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toInteractive = toInteractive;

// $.tabs.addEventListener('close', function(){
	// stopGPS();
	// stopGame();
// });

$.tabs.on('close', function() {
	stopGPS();
	stopGame();
});


//-----------------------------------------------------------
// Metoder för navigering
//-----------------------------------------------------------

function toMap() {
	var mapWind = Alloy.createController('map').getView();
	$.mapWin.add(mapWind);
}

function toInteractive() {
	var interactive = Alloy.createController('interactive').getView();
	$.interactiveWin.add(interactive);
}

function toTrails() {
	var trails = Alloy.createController('trails').getView();
	$.hikeWin.add(trails);
}

function toInfo() {
	var info = Alloy.createController('infoList').getView();
	$.infoWin.add(info);
}

//-----------------------------------------------------------
// Null'ar varje fönster när man trycker på en annan tab.
//-----------------------------------------------------------

$.mapWin.addEventListener('blur', function(){
	$.mapWin = null;
});

$.interactiveWin.addEventListener('blur', function(){
	$.interactiveWin = null;
});

$.hikeWin.addEventListener('blur', function(){
	$.hikeWin = null;
});

$.infoWin.addEventListener('blur', function(){
	$.infoWin = null;
});

$.koster.addEventListener('blur', function(){
	$.koster = null;
});
