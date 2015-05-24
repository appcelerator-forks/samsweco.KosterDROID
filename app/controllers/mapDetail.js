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
	try{
		$.mapDetailView.add(showDetailMap(detailMap, trailId, trailName, trailColor));
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}	
}

function setMarkers(){
	try {
		detailMap.removeAllAnnotations();
		displaySpecificMarkers(trailId, detailMap);
		getSpecificIconsForTrail(trailId);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
	
}

//-----------------------------------------------------------
// Lägger till eventlistener för klick på hotspot
//-----------------------------------------------------------
function addEventList() {
	try {
		detailMap.addEventListener('click', function(evt) {
				if (evt.clicksource == 'rightPane') {
					var hotspotCollection = Alloy.Collections.hotspotModel;
					hotspotCollection.fetch({
						query : query13 + evt.annotation.id + '"'
					});

					var jsonHotspObj = hotspotCollection.toJSON();

					var hotspotTxt = {
						title : evt.annotation.id,
						infoTxt : jsonHotspObj[0].infoTxt,
						id : jsonHotspObj[0].id
					};

					var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
					Alloy.CFG.tabs.activeTab.open(hotspotDetail);
				};
		});
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
}

//-----------------------------------------------------------
// Visar användarens position på detaljkartan
//-----------------------------------------------------------
function getZoomedMapPosition() {
	try {
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
			myPosition = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}	
}

//-----------------------------------------------------------
// Visar och släcker sevärdheter på kartan
//-----------------------------------------------------------
$.geoSwitch1.addEventListener('change', function(e) {
	if ($.geoSwitch1.value == true) {
		getUserPos('hotspot');
	}
	if($.geoSwitch1.value == false){
		stopGPS();
	}
});

//-----------------------------------------------------------
// Visar och släcker kartmenyn på detaljkartan
//-----------------------------------------------------------
function showMenu() {
	try {
		if(!menuDetailVisible){
			$.widgetView.height = '10%';
			menuDetailVisible = true;
		}else {
			$.widgetView.height = '0dp';
			menuDetailVisible = false;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Detaljkartan");
	}
}