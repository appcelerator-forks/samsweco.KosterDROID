
var webview = Titanium.UI.createWebView({ 
	url: 'https://www.instagram.com/kosterhavets.nationalpark/'
});

$.newsfeedView.add(webview);



 var cleanup = function() {
	$.newsfeedWindow.close();
	$.off();
};

var back = function(){
	$.newsfeedWindow.close();
};

$.newsfeedWindow.addEventListener('androidback', back);
