Ti.include("/collectionData.js");

var args = arguments[0] || {};

setRowData();

//-----------------------------------------------------------
// Läser in data till alla listitems
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var rows = returnTrails();

		for (var i = rows.length; i--; ) {
			if (rows[i].id != 8) {

				var row = Ti.UI.createTableViewRow({
					layout : 'horizontal',
					id : rows[i].id,
					height : '90dp',
					top : '0dp',
					hasChild : true,
					rightImage : '/pins/androidarrow2.png'
				});

				var listItem = Ti.UI.createView({
					layout : 'vertical',
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
				});

				var img = Ti.UI.createImageView({
					height : '80dp',
					width : '125dp',
					image : '/pics/' + rows[i].cover_img,
					left : '5dp',
					top : '5dp'
				});

				var labelView = Ti.UI.createView({
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
					backgroundColor : 'white',
					layout : 'vertical'
				});

				var lblName = Ti.UI.createLabel({
					color : '#FCAC17',
					left : '10dp',
					font : {
						fontSize : '14dp',
						fontFamily : 'Raleway-Medium'
					},
					text : rows[i].name
				});

				var lblDistance = Ti.UI.createLabel({
					left : '10dp',
					top : '0dp',
					color : '#000000',
					font : {
						fontSize : '12dp',
						fontFamily : 'Raleway-Light'
					},
					text : 'Sträcka : ' + rows[i].length + " km"
				});

				var lblArea = Ti.UI.createLabel({
					left : '10dp',
					top : '0dp',
					color : '#000000',
					font : {
						fontSize : '12dp',
						fontFamily : 'Raleway-Light'
					},
					text : rows[i].area
				});

				var iconView = showIcons(rows[i].id);

				labelView.add(iconView);
				labelView.add(lblName);
				labelView.add(lblDistance);
				labelView.add(lblArea);

				row.add(img);
				row.add(labelView);

				tableViewData.push(row);
			}
		}
		$.table.data = tableViewData;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Öppnar trail detail med args för den valda leden
//-----------------------------------------------------------
function showTrailDetails(e) {
	try {
		var id = e.rowData.id;

		var trailjsonObj = returnSpecificTrailById(id);

		var args = {
			id : id,
			title : trailjsonObj[0].name,
			length : trailjsonObj[0].length,
			infoTxt : trailjsonObj[0].infoTxt,
			area : trailjsonObj[0].area,
			zoomlat : trailjsonObj[0].zoomLat,
			zoomlon : trailjsonObj[0].zoomLon,
			color : trailjsonObj[0].color,
			jsonfile : trailjsonObj[0].JSONfile
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView().open();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Sätter ikoner för varje vandringsled
//-----------------------------------------------------------
function showIcons(id) {
	try {
		var selectedIcons = returnSpecificIconsByTrailId(id);

		var iconView = Ti.UI.createView({
			layout : 'horizontal',
			height : '25dp',
			width : Ti.UI.FILL,
			backgroundColor : 'white',
			left : '5dp',
			top : '10dp'

		});

		for (var i = 0; i < selectedIcons.length; i++) {
			var iconImgView = Ti.UI.createImageView({
				height : '20dp',
				width : '20dp',
				left : '0dp'
			});

			iconImgView.image = '/images/' + selectedIcons[i].name + '.png';
			iconView.add(iconImgView);
		}
		return iconView;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Vandringsleder");
	}
}

//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
	$.off();
	$.trailWindow.close();

};

var back = function(){
	$.trailWindow.close();
};

$.trailWindow.addEventListener('androidback', back);