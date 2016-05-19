Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

//-----------------------------------------------------------
// Metoder för navigeringen
//-----------------------------------------------------------

function navigate(e) {
	switch 	(e.rowData.id) {
		case "home_row" : {
			//Navigera till Index
			var home = Alloy.createController('index').getView().open;
			break;
		}
		case "hotspots_row" : {
			//Navigera till Sevärdheter
			var hotspots = Alloy.createController('hotspots').getView().open();
			break;
		}
		case "trails_row" : {
			//Navigera till Vandringsleder
			var trails = Alloy.createController('trails').getView().open();
			break;
		}
		case "map_row" : {
			//Navigera till Karta
			var mapView = Alloy.createController('map').getView().open();
			break;
		}
		case "info_row" : {
			//Navigera till Information
			var info = Alloy.createController('infoList').getView().open();
			break;
		}
		case "interactive_row" : {
			//Navigera till Bokstavsjakten
			var interactive = Alloy.createController('interactive').getView().open();
			break;
		}
		case "newsfeed_row" : {
			//Navigera till Instagramflöde
			var newsfeed = Alloy.createController('newsfeed').getView().open();
			break;
		}
		case "boat_row" : {
			//Navigera till Båtresan
			 var boatTrail = returnSpecificTrailById(8);
			 
			 var args = {
				 id : 8,
				 length : 10,
				 area : 'Strömstad-Koster',
				 zoomlat : '58.936458',
				 zoomlon : '11.172279',
				 color : 'boat'
			};
			
			if(language == 'svenska'){
				args.title = boatTrail[0].name;
				args.infoTxt = boatTrail[0].infoTxt;
			} else {
				args.title = boatTrail[0].name_eng;
				args.infoTxt = boatTrail[0].infoTxt_eng;
			}
			
		 	var trailDetail = Alloy.createController('trailDetail', args).getView().open();
			break;
		}
	}
}


var mainMenuOpen = false;

function openMainMenu() {
	if (!mainMenuOpen) {
		$.menuContainerView.height = '80%';
		mainMenuOpen = true;
		
		$.lbl_menu_close.visible = true;
		$.lbl_menu_close.height = '35dp';
		$.lbl_menu_open.height = '0dp';	
		$.lbl_menu_open.visible = false;	
	} else {
		closeMainMenu();
	}
}

function closeMainMenu() {
	if(mainMenuOpen){
		$.menuContainerView.height = '35dp';
		$.lbl_menu_close.visible = false;
		$.lbl_menu_close.height = '0dp';
		$.lbl_menu_open.height = '35dp';	
		$.lbl_menu_open.visible = true;	
		
		mainMenuOpen = false;
	}	
}

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

$.geoSwitchBoat.addEventListener('change', function() {
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
		
		$.geoSwitchBoat.value = false;
	} else {
		if ($.geoSwitchBoat.value == true) {
			Alloy.Globals.getUserPos('boat');
		} else {
			Alloy.Globals.stopBoatGPS();
		}
	} 	
	
});
