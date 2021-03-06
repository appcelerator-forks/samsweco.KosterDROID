Ti.include("/SQL.js");
Ti.include("/collectionData.js");

var args = arguments[0] || {};

if(language == 'svenska'){
	$.lblHotspotName.text = args.title || "Name";
	$.lblHotspotInfoTxt.text = args.infoTxt || "Info";
} else {
	$.lblHotspotName.text = args.titleEng || "Name";
	$.lblHotspotInfoTxt.text = args.infoTxtEng || "Info";
}

var hotspotId = args.id || "Id";
var picId = args.filename || "filename";
var latitude = args.x;
var longitude = args.y;

selectHotspotPics();
showHotspotDetailMap();

function showHotspotDetailMap(){
	var map = showHotspotOnMap(latitude, longitude, hotspotId);
	$.showHotspotMap.add(map);
}
//-----------------------------------------------------------
// Hämtar bilder för bildspelet
//-----------------------------------------------------------
function selectHotspotPics() {
	try {
		var jsonMedia = returnSpecificPics(hotspotId);

		for (var i = 0; i < jsonMedia.length; i++) {
			var img_view = Ti.UI.createImageView({
				image : "/pics/" + jsonMedia[i].filename + '.png',	
				width : '100%',
				height : '240dp' ,
				top : '0dp'
			});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '1dp',
				color : 'white',
				font : {
					fontSize : '14dp',
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Light'
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
 	 $.hotspotDetail.close();
	 $.off();
};

var back = function(){
	$.hotspotDetail.close();
	cleanup();
};

$.hotspotDetail.addEventListener('androidback', back);


