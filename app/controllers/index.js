$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toQuiz = toQuiz;


//-----------------------------------------------------------
// Metoder för navigering
//-----------------------------------------------------------

function toMap() {
	var mapWind = Alloy.createController('map').getView();
	$.mapWin.add(mapWind);
}

function toQuiz() {
	var quizDetail = Alloy.createController('quizDetail').getView();
	$.quizWin.add(quizDetail);
}


function toTrails() {
	var trails = Alloy.createController('trails').getView();
	$.hikeWin.add(trails);
}

function toInfo() {
	var info = Alloy.createController('infoList').getView();
	$.infoWin.add(info);
}

// var mapWidget = require('/mapmenu/widget');
function showMapMenu(){
	// $.menuwidget.show();
	Alloy.Globals.showMenuWidget();
}
