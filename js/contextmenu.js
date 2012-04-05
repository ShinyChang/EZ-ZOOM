var ezZoomContextMenu = {
	title : "EZ ZOOM",
	create : function() {
		this.destory();
		chrome.contextMenus.create({
			"title" : this.title,
			"contexts" : ["page", "selection", "link", "editable", "image", "video", "audio"],
			"onclick" : function(info, tab) {
				chrome.tabs.sendRequest(tab.id, {
					method : "zoomTarget"
				}, function(response) {
					// do nothing
				});
			}
		});
	},
	destory : function() {
		chrome.contextMenus.removeAll();
	}
};
