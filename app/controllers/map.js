var args = arguments[0] || {};

var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var route;
var radius = 20;
//var MapModule = require('ti.map');
Alloy.Globals.MapModule = MapModule;

var infospotsNotVisible = true;
var hotspotsNotVisible = true;

var infospotsAnnotation;
var hotspotAnnotation;

var trailsCollection = getTrailsCollection();
var hotspotCollection = getHotspotCollection();
var jsonFileCollection = getJSONfiles();

//-----------------------------------------------------------
// Onload-funktioner för kartan
//-----------------------------------------------------------
// try {
showMap();
setRoutes();
displayTrailMarkers();
// } catch(e) {
// newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - load page");
// }


//-----------------------------------------------------------
// Sätter ut alla vandringsleder på kartan
//-----------------------------------------------------------
function setRoutes() {
	try {
		trailsCollection.fetch({
			query : 'SELECT id, name, color FROM trailsModel'
		});

		var jsonObjRoutes = trailsCollection.toJSON();
		for (var i = 0; i < jsonObjRoutes.length; i++) {
			var file = getFile(jsonObjRoutes[i].id);

			for (var u = 0; u < file.length; u++) {
				createMapRoutes(file[u].filename, jsonObjRoutes[i].name, jsonObjRoutes[i].color);
			}
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "infoList - getInfoDetails");
	}

}

//-----------------------------------------------------------
// Hämtar JSON-fil för en vandringsled
//-----------------------------------------------------------
function getFile(id) {
	try {
		jsonFileCollection.fetch({
			query : 'SELECT filename FROM jsonFilesModel WHERE trailID ="' + id + '"'
		});

		var filename = jsonFileCollection.toJSON();
		return filename;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - getFile");
	}
}

//-----------------------------------------------------------
// Skapar en vandringsled på kartan
//-----------------------------------------------------------
function createMapRoutes(file, name, color) {
	try {
		var routes = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/" + file).read().text;
		var parsedRoute = JSON.parse(routes);

		var geoArray = [];
		geoArray.push(parsedRoute);

		for (var u = 0; u < geoArray.length; u++) {
			var coords = geoArray[0].features[0].geometry.paths[u];

			var points = new Array();

			for (var i = 0; i < coords.length; i++) {

				var c = {
					latitude : coords[i][1],
					longitude : coords[i][0]
				};
				points.push(c);
			}

			var route = {
				name : name,
				points : points,
				color : color,
				width : 3.0
			};
			baseMap.addRoute(MapModule.createRoute(route));
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - createMapRoutes");
	}
}


//-----------------------------------------------------------
// Läser in kartvyn
//-----------------------------------------------------------
function showMap() {
	try {
		baseMap = MapModule.createView({
			userLocation : true,
			mapType : MapModule.HYBRID_TYPE,
			animate : true,
			region : {
				latitude : 58.886775,
				longitude : 11.026024,
				latitudeDelta : 0.08,
				longitudeDelta : 0.08
			},
			height : '100%',
			width : Ti.UI.FILL
		});

		$.mapView.add(baseMap);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
	}
}

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers() {
	try {
		trailsCollection.fetch({
			query : 'SELECT name, pinLon, pinLat, color FROM trailsModel'
		});

		var jsonObjTrails = trailsCollection.toJSON();
		for (var i = 0; i < jsonObjTrails.length; i++) {

			color = jsonObjTrails[i].color.toUpperCase();
			Ti.API.info(JSON.stringify(color));

			var markerAnnotation = MapModule.createAnnotation({
				id : jsonObjTrails[i].name,
				latitude : jsonObjTrails[i].pinLat,
				longitude : jsonObjTrails[i].pinLon,
				title : jsonObjTrails[i].name,
				pincolor : MapModule.ANNOTATION_AZURE,
				subtitle : 'Läs mer om ' + jsonObjTrails[i].name + ' här!',
				rightButton : '/pins/androidarrow2.png',
				name : 'trail',
				font : {
					fontFamily : 'Raleway-Light'
				}
			});

			// markerAnnotation.pincolor = Alloy.Globals.MapModule.ANNOTATION_GREEN;

			baseMap.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	}
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myId) {
	try {
		trailsCollection.fetch({
			query : 'SELECT * FROM trailsModel where name ="' + myId + '"'
		});

		var jsonObjTr = trailsCollection.toJSON();

		var args = {
			id : jsonObjTr[0].id,
			title : myId,
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
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showTrail");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(myId) {
	try {
		hotspotCollection.fetch({
			query : 'SELECT id, infoTxt FROM hotspotModel where name = "' + myId + '"'
		});

		var jsonObjHot = hotspotCollection.toJSON();

		var hotspotTxt = {
			title : myId,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		Alloy.CFG.tabs.activeTab.open(hotspotDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showHotspot");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
baseMap.addEventListener('click', function(evt) {

	if (evt.clicksource == 'rightPane') {
		if (evt.annotation.name == 'hotspot') {
			showHotspot(evt.annotation.id);
		} else {
			showTrail(evt.annotation.id);
		}
	}
});

function showMapMenu() {
	Alloy.Globals.showMenuWidget();
}

