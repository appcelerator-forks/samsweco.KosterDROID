Ti.include("/SQL.js");
Ti.include("/collectionData.js");

var args = arguments[0] || {};

$.lblHotspotName.text = args.title || "Name";
$.lblHotspotInfoTxt.text = args.infoTxt || "Info";
var hotspotId = args.id || "Id";
var picId = args.filename || "filename";

selectHotspotPics();

//-----------------------------------------------------------
// Hämtar bilder för bildspelet
//-----------------------------------------------------------
function selectHotspotPics() {
	try {
		var jsonMedia = returnSpecificPics(hotspotId);

		for (var i = 0; i < jsonMedia.length; i++) {
			var img_view = Ti.UI.createView({
				backgroundImage : "/pics/" + jsonMedia[i].filename + '.png',	
				width : '100%',
				height : '240dp' ,
				top : '0dp'
			});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '1dp',
				text : jsonMedia[i].img_txt,
				color : 'white',
				font : {
					fontSize : '14dp',
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Light'
				}
			});

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'black',
				height : '265dp',
				width : Ti.UI.FILL
			});

			backgroundView.add(img_view);
			backgroundView.add(lblImgTxt);
			
			$.slideShowHotspotDetail.addView(backgroundView);
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Sevärdhet");
	}
}

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
	$.destroy();
	$.off();
	$.hotspotDetail = null;
};

$.hotspotDetail.addEventListener('close', cleanup);
