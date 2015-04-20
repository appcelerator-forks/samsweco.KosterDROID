
// var interactiveVisible = false;


// function showInteractive() {
	// if (!interactiveVisible) {
		// $.interactive.show();
		// interactiveVisible = true;
	// } else {
		// $.interactive.hide();
		// interactiveVisible = false;
	// }
// }

function closeInteractive(){
		$.interactive.hide();
		interactiveVisible = false;
}
// 
// $.mapmenu.addEventListener('swipe', function() {
	// closeMapMenu();
// });

Alloy.Globals.showInteractive = showInteractive;
Alloy.Globals.closeInteractive = closeInteractive;
