$.tabs.open();
Alloy.CFG.tabs = $.tabs;
exports.toQuiz = toQuiz;

$.tabs.addEventListener('focus', function(e){
	Alloy.CFG.tabs._activeTab = e.tab;
	
	Ti.API.info('tab : ' + Alloy.CFG.tabs._activeTab.title);
	
});


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

$.mapWin.addEventListener('blur', function(){
	$.mapWin = null;
	Ti.API.info('win null : ' + $.mapWin);
});
