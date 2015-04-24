function showInteractive(clueTxt) {
	if (!interactiveVisible) {
		$.interactiveView.show();
		$.lblClue.text = clueTxt;
		interactiveVisible = true;
	} else {
		$.interactiveView.hide();
		interactiveVisible = false;
	}	
}

function closeInteractive() {
	$.interactiveView.hide();
	interactiveVisible = false;
}

Alloy.Globals.showInteractive = showInteractive;
Alloy.Globals.closeInteractive = closeInteractive;