// get current tab's domain
function getCurrentTabDomain(callback) {
	//console.log("get current tab\'s domain");
	chrome.tabs.getSelected(null, function(tab) {
		callback(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1]);
	});
};

// handle request which is from context or popup page
function requestFromTabs(request, sender, sendResponse) {

	//update database trigger by context or popup page
	if(request.method == "setZoomLevel") {

		//update extension badge
		chrome.browserAction.setBadgeText({
			text : request.key
		});
		//console.log("set zoom:" + request.key);

		//get current tab's domain and update database
		chrome.tabs.getSelected(null, function(tab) {
			addDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], request.key);
		});
		//response
		sendResponse({
			status : "ok"
		});

		//response domain zoom level when tab switched, new tab created and popup page opened.
	} else if(request.method == "getZoomLevel") {

		//get current tab
		chrome.tabs.getSelected(null, function(tab) {

			//query database and response
			ezZoom.indexedDB.getDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], function(result) {

				//response
				sendResponse({
					status : result
				});
			});
		});
	}
};

//set current tab's zoom level
function setZoomOfCurrentTab(tabId, selectInfo) {
	// console.log("tab changed");

	// get current tab
	chrome.tabs.getSelected(null, function(tab) {
		
		//query domain zoom level
		ezZoom.indexedDB.getDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], function(result) {
			//console.log("tab zoom level:" + result);
			
			//set default zoom level when current tab never zoomed or can not zoom 
			if(result === undefined) {
				result = "100";
			}
			
			//update extension badge
			chrome.browserAction.setBadgeText({
				text : result
			});
		});
	});
};


//default zoom level badge
function setDefaultZoomOnBadge() {
	chrome.browserAction.setBadgeText({
		text : "100"
	});
};

//create context menu
function createContextMenu() {
	ezZoomContextMenu.create();
};

//remove context menu
function destoryContextMenu() {
	chrome.contextMenus.removeAll();
}

//init
function initEzZoom() {
	chrome.extension.onRequest.addListener(requestFromTabs);
	chrome.tabs.onActiveChanged.addListener(setZoomOfCurrentTab);
	createContextMenu();
	setDefaultZoomOnBadge();
};