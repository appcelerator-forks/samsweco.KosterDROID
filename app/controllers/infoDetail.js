Ti.include("/collectionData.js");

var args = arguments[0] || {};

//-----------------------------------------------------------
// Args skickade från listvy
//-----------------------------------------------------------
try {
	if(language == 'svenska'){
		$.lblInfoTitle.text = args.name || "Title";
		$.lblInfoText.text = args.infoTxt || "Info";
	} else {
		$.lblInfoTitle.text = args.nameEng || "Title";
		$.lblInfoText.text = args.infoTxtEng || "Info";
	}
	
	$.infoImg.image = "/pics/" + args.img;
	var id = args.id;
	
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "infoDetail - load data into labels");
}

//-----------------------------------------------------------
// Onload
//-----------------------------------------------------------
setRowData();

//-----------------------------------------------------------
// Visar data om infon som valdes i listan
//-----------------------------------------------------------
function showinfoDetails(info) {
	try {
		var selectedInfo = info.row;
		var args = {
			id : selectedInfo.id,
			name : selectedInfo.name,
			infoTxt : selectedInfo.infoTxt,
			link : selectedInfo.link,
			img : selectedInfo.image,
			desc : selectedInfo.desc
		};

		var infoDetail = Alloy.createController("infoDetail", args).getView();
		infoDetail.open();
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Information");
	}
}

//-----------------------------------------------------------
// Sätter alla items i urllistan
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var urlList = returnUrlByInfoId(id);

		for (var i = 0; i < urlList.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : urlList[i].id,
				height : '60dp',
				top : '0dp',
				hasChild : true,
				rightImage : '/pins/androidarrow2.png'
			});

			var linkName = Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : '15dp',
				right : '15dp',
				font : {
					fontSize : '13dp',
				},
				color : '#0098C3'
				//text : urlList[i].linkname
			});
			
			
			if(language == 'svenska'){
				linkName.text = urlList[i].linkname;
			} else {
				linkName.text = urlList[i].linkname_eng;
			}

			row.add(linkName);
			tableViewData.push(row);
		}

		if (tableViewData.length > 0) {
			$.tableView.data = tableViewData;
			$.lblLink.show();
		}
		else {
			$.lblLink.hide();
			$.tableView.height = 0;
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Information");
	}
}

//-----------------------------------------------------------
// Hämtar all info som ska läsas in i listan
//-----------------------------------------------------------
function getLink(e) {
	try {
		var rowId = e.rowData.id;
		var urlById = returnUrlById(rowId);

		var txt;
		var titl; 
		
		if(language == 'svenska'){
			txt = urlById[0].url;
			titl = urlById[0].linkname;
		} else {
			txt = urlById[0].url_eng;
			titl = urlById[0].linkname_eng;
		}
		
		if(rowId != 3 && rowId != 4){			
			openLink(txt); 
		} else if(rowId == 3 || rowId == 4){			
			showRules(txt, titl);
		} 
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Öppnar url'en i en webView.
//-----------------------------------------------------------
function openLink(link) {
	
	//ÄNDRA
	try {
		var webview = Titanium.UI.createWebView({
			url : link
		});
		var window = Titanium.UI.createWindow();
		window.add(webview);
		window.open();
		
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Information");
	}
}

//-----------------------------------------------------------
// Öppnar regler i en egen vy
//-----------------------------------------------------------
function showRules(infTxt, linktitle){
	try {
		var infoWindowRules = Ti.UI.createWindow({
			layout : 'vertical',
			top : '0dp',
			backgroundColor : 'white',
			// ÄNDRA
			backButtonTitle : "Tillbaka"
		});

		var infoScrollRules = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true,
			layout : 'vertical',
			top : '0dp'
		});

		var viewen = Ti.UI.createView({
			layout : 'vertical',
			top : '0dp',
			height : Ti.UI.SIZE
		});

		var infoDetailTitleLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '15dp',
				fontFamily : 'Raleway-Medium'
			},
			color : '#FCAF17',
			text : linktitle
		});

		var infoDetailLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '14dp',
				fontFamily : 'Raleway-Light'
			},
			text : infTxt
		});

		viewen.add(infoDetailTitleLbl);
		viewen.add(infoDetailLbl);
		infoScrollRules.add(viewen);
		infoWindowRules.add(infoScrollRules);

		infoWindowRules.open();

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}


//-----------------------------------------------------------
// Rensar vid stängning
//-----------------------------------------------------------
 var cleanup = function() {
 	$.infoDetail.close();
	$.off();
};


var back = function(){
	$.infoDetail.close();
};

//$.infoDetail.addEventListener('close', cleanup);
$.infoDetail.addEventListener('androidback', back);

	