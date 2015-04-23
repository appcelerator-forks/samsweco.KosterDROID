
function showInteractive() {
	if (!interactiveVisible) {
		$.interactiveView.show();
		interactiveVisible = true;
	} else {
		$.interactiveView.hide();
		interactiveVisible = false;
	}
}
Alloy.Globals.showInteractive = showInteractive;

function closeInteractive() {
	$.interactiveView.hide();
	interactiveVisible = false;
}
Alloy.Globals.closeInteractive = closeInteractive;