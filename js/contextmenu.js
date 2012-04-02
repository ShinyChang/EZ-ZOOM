function genericOnClick(info, tab) {
	chrome.tabs.sendRequest(tab.id, {
		method : "zoomTarget"
	}, function(response) {
		// do nothing
	});
}

function initContextMenu() {
	var id = chrome.contextMenus.create({
		"title" : "EZ ZOOM",
		"contexts" : ["page", "image"],
		"onclick" : genericOnClick
	});
}