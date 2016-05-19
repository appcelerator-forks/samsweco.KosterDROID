Ti.include("/mapFunctions.js");
Ti.include("/collectionData.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// Args från trails - klick på item i listan
//-----------------------------------------------------------
	
if(language == 'svenska'){
	$.trailDetail.title = args.title;
	$.lblTrailName.text = args.title || 'Default Name';
	$.lblTrailInfo.text = args.infoTxt || 'Default infoText';
} else {
	$.trailDetail.title = args.titleEng;
	$.lblTrailName.text = args.titleEng || 'Default Name';
	$.lblTrailInfo.text = args.infoTxtEng || 'Default infoText';
}
	
$.lblTrailLength.text = args.length + " kilometer" || 'Default Length';
$.lblTrailArea.text = args.area || 'Default Color';

var trailId = args.id;
globalTrailID = trailId;

if (args.title == 'Äventyrsslingan') {
	$.btnSendTo.show();
	$.btnSendTo.height = '30dp';
	$.btnSendTo.title = String.format(L('goToGame_btn'), '');

	$.btnSendTo.addEventListener('click', function() {
		var interactive = Alloy.createController('interactive').getView().open();
		$.trailDetail.close();
	});
}

if(args.title == 'Båtresan'){	
	$.lblTrailName.top = '10dp';
	$.btnTrailOnMap.title = String.format(L('goToDetailMapBoat_btn'), '');	
	$.switchView.show();
	$.switchView.height = Titanium.UI.SIZE;
} else {
	$.btnTrailOnMap.title = String.format(L('goToDetailMap_btn'), '');
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



//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
selectTrailPics();
LoadHotspotList();
showIcons();
// changeLabel();

//-----------------------------------------------------------
// hämtar info för den vandringsled som ska öppnas i detaljvy
//-----------------------------------------------------------
function zoomMapTrail() {
	var trail = {
		id : args.id,
		title : args.title,
		color : args.color,
		zoomlat : args.zoomlat,
		zoomlon : args.zoomlon
	};

	var mapDetail = Alloy.createController("mapDetail", trail).getView().open();
}

//-----------------------------------------------------------
// Sorterar bilderna i ordning
//-----------------------------------------------------------
function sortByName(a, b) {
	var x = a.img_order;
    var y = b.img_order;
    
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

//-----------------------------------------------------------
// Hämtar bilder till bildspel för den valda vandringsleder
//-----------------------------------------------------------
function selectTrailPics() {
	try {
	var jsonMedia = returnSpecificTrailPics(trailId);
	jsonMedia.sort(sortByName);

	for (var i = 0; i < jsonMedia.length; i++) {
		var img_view = Ti.UI.createImageView({
			image : "/pics/" + jsonMedia[i].filename + '.png',
			width : '100%',
			height : '235dp',
			top : '0dp'
		});

		var lblImgTxt = Ti.UI.createLabel({
			left : '15dp',
			top : '1dp',
			//text : jsonMedia[i].img_txt,
			color : 'white',
			font : {
				fontSize : '14dp',
				fontStyle : 'italic',
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				fontFamily : 'Raleway-Light'
			}
		});
		
		if(language == 'svenska'){
			lblImgTxt.text = jsonMedia[i].img_txt;
		} else {
			lblImgTxt.text = jsonMedia[i].img_txt_eng;
		}


		var backgroundView = Ti.UI.createView({
			layout : 'vertical',
			backgroundColor : 'black',
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});

		backgroundView.add(img_view);
		backgroundView.add(lblImgTxt);

		$.slideShowTrails.addView(backgroundView);
	}
	} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled");
	}

}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDetail(e) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(e.rowData.id);
		var hotspotId;
		var x;
		var y;
		
		if(jsonObjHot[0].id == 32){
			hotspotId = 42;
			x = 58.893085;
			y = 11.047972;
		} else {
			hotspotId = jsonObjHot[0].id;
			x = jsonObjHot[0].xkoord;
			y = jsonObjHot[0].ykoord;
		}

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			titleEng : jsonObjHot[0].engelsk_titel,
			infoTxt : jsonObjHot[0].infoTxt,
			infoTxtEng : jsonObjHot[0].engelsk_beskrivning,
			id : hotspotId,
			x : x,
			y : y
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView().open();
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Visa sevärdhet");
	}
}

//-----------------------------------------------------------
// Visar hotspots för en vald vandringsled
//-----------------------------------------------------------
function LoadHotspotList() {
	try {
		var tableViewData = [];
		var tableRow = returnSpecificHotspotsByTrailId(trailId);

		for (var i = 0; i < tableRow.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : tableRow[i].name,
				layout : 'horizontal',
				height : '90dp',
				top : '0dp',
				hasChild : true,
				rightImage : '/pins/androidarrow2.png'
			});

			var img = Ti.UI.createImageView({
				height : '80dp',
				width : '125dp',
				image : '/pics/' + tableRow[i].cover_pic,
				left : '15dp',
				top : '10dp'
			});

			var labelView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : 'white',
				layout : 'vertical'
			});

			var lblName = Ti.UI.createLabel({
				color : '#FCAF17',
				top : '35dp',
				left : '20dp',
				font : {
					fontSize : '14dp',
					fontFamily : 'Raleway-Medium'
				}
				//text : tableRow[i].name
			});
			
			if(language == 'svenska'){
				lblName.text = tableRow[i].name;
			} else {
				lblName.text = tableRow[i].engelsk_titel;
			}

			labelView.add(lblName);

			row.add(img);
			row.add(labelView);

			tableViewData.push(row);
		}

		$.hotspotTable.data = tableViewData;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled");
	}
}

//-----------------------------------------------------------
// Öppnar detaljvy med vald hotspot - klickad på i kartvyn
//-----------------------------------------------------------
function sendToHotspot(e) {
	try {
		showHotspotDetail(e.rowData.id);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled - SendToHotspot");
	}
}

//-----------------------------------------------------------
// Sätter ut ikoner i kartvyn.
//-----------------------------------------------------------
function showIcons() {
	try {
		var selectedIcons = returnSpecificIconsByTrailId(trailId);

		for (var i = 0; i < selectedIcons.length; i++) {
			var covericon = Ti.UI.createImageView({
				height : '25dp',
				width : '25dp',
				left : '0dp',
				top : '10dp',
				image : '/images/' + selectedIcons[i].name + '.png'
			});

			$.iconrow.add(covericon);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsled");
	}
}

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
	$.off();
	detailMap.removeEventListener('click', evtList);
	detailMap.removeAllAnnotations();
	$.trailDetail.close();
};

$.trailDetail.addEventListener('androidback', cleanup);
