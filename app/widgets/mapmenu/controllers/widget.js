Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");

//----------------------------------------------------------- // 
//Switch för att visa hotspots/sevärdheter på kartan 
//----------------------------------------------------------- 

$.hotspotSwitch.addEventListener('change', function(e) { 
	if ($.hotspotSwitch.value == true) { 
		displayAllMarkers(bigMap); 
	} else { 
		removeAnnoHotspot(bigMap); 
	} 
});

//-----------------------------------------------------------
// Startar och avslutar location-event för hotspots/sevärdheter
//-----------------------------------------------------------
$.geoSwitchHotspot.addEventListener('change', function(e) {
	if (!Ti.Geolocation.locationServicesEnabled) {
		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK']
		});
		
		if(language == 'svenska'){
			alertDialog.title = 'Påminnelser';
			alertDialog.message = 'Tillåt appen att se din position för att kunna få påminnelser när du närmar dig en sevärdhet!';
		} else {
			alertDialog.title = 'Reminders';
			alertDialog.message = 'Allow the app to see your position in order to get reminders when you approach an attraction!';
		}
		
		alertDialog.show();
		
		$.geoSwitchHotspot.value = false;
	} else {
		if ($.geoSwitchHotspot.value == true) {
			Alloy.Globals.getUserPos('hotspot');
			hotspotGPS = true;
		} else {
			Alloy.Globals.stopGPS();
			hotspotGPS = false;
		}
	} 
});

if(hotspotGPS){
	$.geoSwitchHotspot.value = true;
} else {
	$.geoSwitchHotspot.value = false;
}

//-----------------------------------------------------------
// Funktioner för att tända och släcka infopunkter på kartan
//-----------------------------------------------------------
function showFarglage() {
	try {
		if (farjelage == false) {
			bigMap.addAnnotations(displayInfoSpots('farjelage'));
			$.btnShowFarjelage.backgroundImage = '/images/farjelage.png';
			farjelage = true;
		} else {
			removeAnnoSpot('info', 'farjelage');
			$.btnShowFarjelage.backgroundImage = '/images/grayfarjelage.png';
			farjelage = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showTaltplats() {
	try {
		if (taltplats == false) {
			bigMap.addAnnotations(displayInfoSpots('taltplats'));
			$.btnShowTaltplats.backgroundImage = '/images/taltplats.png';
			taltplats = true;
		} else {
			removeAnnoSpot('info', 'taltplats');
			$.btnShowTaltplats.backgroundImage = '/images/graytaltplats.png';
			taltplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showEldplats() {
	try {
		if (eldplats == false) {
			bigMap.addAnnotations(displayInfoSpots('eldplats'));
			$.btnShowEldplats.backgroundImage = '/images/eldplats.png';
			eldplats = true;
		} else {
			removeAnnoSpot('info', 'eldplats');
			$.btnShowEldplats.backgroundImage = '/images/grayeldplats.png';
			eldplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showSnorkelled() {
	try {
		if (snorkel == false) {
			bigMap.addAnnotations(displayInfoSpots('snorkelled'));
			$.btnShowSnorkelled.backgroundImage = '/images/snorkelled.png';
			snorkel = true;
		} else {
			removeAnnoSpot('info', 'snorkelled');
			$.btnShowSnorkelled.backgroundImage = '/images/graysnorkelled.png';
			snorkel = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showInformation() {
	try {
		
		Ti.API.info('innan');
		
		if (information == false) {
			bigMap.addAnnotations(displayInfoSpots('information'));
			$.btnShowInformation.backgroundImage = '/images/information.png';
			information = true;
		} else {
			removeAnnoSpot('info', 'information');
			$.btnShowInformation.backgroundImage = '/images/grayinformation.png';
			information = false;
		}
		
		Ti.API.info('klar');
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showBadplats() {
	try {
		if (badplats == false) {
			bigMap.addAnnotations(displayInfoSpots('badplats'));
			$.btnShowBadplats.backgroundImage = '/images/badplats.png';
			badplats = true;
		} else {
			removeAnnoSpot('info', 'badplats');
			$.btnShowBadplats.backgroundImage = '/images/graybadplats.png';
			badplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}

function showRastplats() {
	try {
		if (rastplats == false) {
			bigMap.addAnnotations(displayInfoSpots('rastplats'));
			$.btnShowRastplats.backgroundImage = '/images/rastplats.png';
			rastplats = true;
		} else {
			removeAnnoSpot('info', 'rastplats');
			$.btnShowRastplats.backgroundImage = '/images/grayrastplats.png';
			rastplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showUtkiksplats() {
	try {
		if (utsiktsplats == false) {
			bigMap.addAnnotations(displayInfoSpots('utsiktsplats'));
			$.btnShowUtsiktsplats.backgroundImage = '/images/utsiktsplats.png';
			utsiktsplats = true;
		} else {
			removeAnnoSpot('info', 'utsiktsplats');
			$.btnShowUtsiktsplats.backgroundImage = '/images/grayutsiktsplats.png';
			utsiktsplats = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}
}

function showTorrdass() {
	try {
		if (torrdass == false) {
			bigMap.addAnnotations(displayInfoSpots('torrdass'));
			$.btnShowTorrdass.backgroundImage = '/images/torrdass.png';
			torrdass = true;
		} else {
			removeAnnoSpot('info', 'torrdass');
			$.btnShowTorrdass.backgroundImage = '/images/graytorrdass.png';
			torrdass = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartmenyn");
	}	
}
