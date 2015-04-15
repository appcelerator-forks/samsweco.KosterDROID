$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toQuiz = toQuiz;

var theWindow = Titanium.UI.currentTab.window;
alert(theWindow);

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
