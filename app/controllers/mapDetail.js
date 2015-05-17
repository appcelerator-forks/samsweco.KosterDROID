Ti.include("/geoFunctions.js");
Ti.include("/mapFunctions.js");

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

var trailsCollection = getTrailsCollection();

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
showMapDetail();
addEventList();
setMarkers();

//-----------------------------------------------------------
// Functioner för att öppna och fylla kartan
//-----------------------------------------------------------
function showMapDetail(){
	$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
}

function setMarkers(){
	detailMap.removeAllAnnotations();
	displaySpecificMarkers(trailId, detailMap);
	getSpecificIconsForTrail(trailId);
}

//-----------------------------------------------------------
// Lägger till eventlistener för klick på hotspot
//-----------------------------------------------------------
function addEventList() {
	try {
		detailMap.addEventListener('click', function(evt) {
			if (evt.annotation.name == 'hotspot') {
				if (evt.clicksource == 'rightButton') {
					var hotspotCollection = Alloy.Collections.hotspotModel;
					hotspotCollection.fetch({
						query : 'SELECT id, infoTxt from hotspotModel where name = "' + evt.annotation.id + '"'
					});

					var jsonHotspObj = hotspotCollection.toJSON();

					var hotspotTxt = {
						title : evt.annotation.id,
						infoTxt : jsonHotsObj[0].infoTxt,
						id : jsonHotsObj[0].id
					};

					var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
					Alloy.CFG.tabs.activeTab.open(hotspotDetail);
				};
			}
		});
		

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - addEventListener");
	}
}

function getZoomedMapPosition() {
	if (myPosition == false) {
		getPosition();
		myPosition = true;
	} else {

		detailMap.region = {
			latitude : zoomLat,
			longitude : zoomLon,
			latitudeDelta : 0.03,
			longitudeDelta : 0.03
		};	
	
		detailMap.animate = true;
		detailMap.userLocation = true;
		myPosition = false;
	}
}

$.geoSwitch1.addEventListener('change', function(e) {
	if ($.geoSwitch1.value == true) {
		getUserPos('hotspot');
	}
	if($.geoSwitch1.value == false){
		stopGPS();
	}
});

// $.posSwitch1.addEventListener('change', function(e) {
	// if ($.posSwitch1.value == true) {
		// getPos(detailMap);
		// myPosition = true;
	// } else {
		// detailMap.userLocation = false;
		// myPosition = false;
// 		
	// }
// });

// $.btnMenuDetail.addEventListener('click', function() {
	// openMenu();
// });

// function openMenu() {
	// if (menuDetail) {
		// closeMenu();
		// menuDetail = false;
	// } else {
		// $.widgetView.height = '190dp';
		// menuDetail = true;
	// }
// }
// 
// function closeMenu() {
	// $.widgetView.height = '0dp';
// }


function showMenu() {
	try {

		if(!menuDetailVisible){
			$.widgetView.height = '15%';
			menuDetailVisible = true;
		}else {
			$.widgetView.height = '0dp';
			menuDetailVisible = false;
		}
		
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - getZoomedMapPosition");
	}

}