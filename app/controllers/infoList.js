Ti.include("/collectionData.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
setRowData();

//-----------------------------------------------------------
// Visar info för valt item i listvyn
//-----------------------------------------------------------
function showinfoDetails(info) {
	try {
		var selectedInfo = info.row;
		var args = {
			name : selectedInfo.name,
			nameEng : selectedInfo.name_eng,
			infoTxt : selectedInfo.infoTxt,
			infoTxtEng : selectedInfo.infoTxt_eng,
			link : selectedInfo.link,
			img : selectedInfo.image,
			desc : selectedInfo.desc
		};
		
		alert('selectedInfo: ' + JSON.stringify(selectedInfo));

		var infoDetail = Alloy.createController("infoDetail", args).getView().open();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationslistan");
	}
}

//-----------------------------------------------------------
// sätter alla items i listan
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var rows = returnAllInfo();

		for (var i = 0; i < rows.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : i + 1,
				layout : 'horizontal',
				height : '90dp',
				top : '0dp',
				hasChild : true,
				rightImage : '/pins/androidarrow2.png'
			});

			var labelView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : 'white',
				layout : 'vertical'
			});

			var coverimg = Ti.UI.createImageView({
				height : '80dp',
				width : '125dp',
				left : '5dp',
				image : "/pics/" + rows[i].cover_img,
				top : '10dp'
			});

			var lblName = Ti.UI.createLabel({
				left : '5dp',
				top : '35dp',
				color : '#FCAF17',
				font : {
					fontSize : '14dp',
					fontFamily: 'Raleway-Medium'
				}
				//text : rows[i].name
			});

			if(language == 'svenska'){
				lblName.text = rows[i].name;
			} else {
				lblName.text = rows[i].name_eng;
			}

			labelView.add(lblName);

			row.add(coverimg);
			row.add(labelView);

			tableViewData.push(row);
		}
		$.table.data = tableViewData;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationslistan");
	}
}
//-----------------------------------------------------------
// Hämtar all info som ska läsas in i listan
//-----------------------------------------------------------
function getInfoDetails(e) {
	try {
		var id = e.rowData.id;
		var jsonObjInfo = returnSpecificInfo(id);

		var infoText = {
			name : jsonObjInfo[0].name,
			nameEng : jsonObjInfo[0].name_eng,
			infoTxt : jsonObjInfo[0].infoTxt,
			infoTxtEng : jsonObjInfo[0].infoTxt_eng,
			id : id,
			img : jsonObjInfo[0].cover_img,
			link : jsonObjInfo[0].url,
			desc : jsonObjInfo[0].desc
		};

		var infoDetail = Alloy.createController("infoDetail", infoText).getView().open();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationslistan");
	}

}


//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
 	$.infoWindow.close();
	$.off();
};

var back = function(){
	$.infoWindow.close();
};

$.infoWindow.addEventListener('androidback', back);