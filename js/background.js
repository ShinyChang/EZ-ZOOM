// get current tab's domain
function getCurrentTabDomain(callback) {
	//console.log("get current tab\'s domain");
	chrome.tabs.getSelected(null, function(tab) {
		callback(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1]);
	});
};

// handle request which is from context or popup page
function requestFromTabs(request, sender, sendResponse) {

	switch(request.method) {
		//update database trigger by context or popup page
		case "setZoomLevel":
			//update extension badge
			chrome.browserAction.setBadgeText({
				text : request.key
			});
			//console.log("set zoom:" + request.key);

			//get current tab's domain and update database
			chrome.tabs.getSelected(null, function(tab) {

				//indexDB function
				addDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], request.key);
			});
			//response
			sendResponse({
				status : "ok"
			});
			break;
		//response domain zoom level when tab switched, new tab created and popup page opened.
		case "getZoomLevel":
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
			break;
		case "getParameter":
			//response
			sendResponse({
				max : localStorage.getItem("maxZoomLevel"),
				min : localStorage.getItem("minZoomLevel"),
				step : localStorage.getItem("zoomStep")
			});
			break;
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
	if(localStorage.getItem("contextMenu") === "checked") {
		ezZoomContextMenu.create();
	}
};

//remove context menu
function destoryContextMenu() {
	chrome.contextMenus.removeAll();
}

//control the version of ezZoom
function versionControl() {
	if(localStorage.getItem("version") !== "1.6.5") {
		//init context menu
		localStorage.setItem("version", "1.6.5");
		localStorage.removeItem("updateInfo");

		//default parameter
		if(!localStorage.getItem("contextMenu")) {
			localStorage.setItem("contextMenu", "checked");
		}
		if(!localStorage.getItem("maxZoomLevel")) {
			localStorage.setItem("maxZoomLevel", "300");
		}
		if(!localStorage.getItem("minZoomLevel")) {
			localStorage.setItem("minZoomLevel", "10");
		}
		if(!localStorage.getItem("zoomStep")) {
			localStorage.setItem("zoomStep", "10");
		}
		if(!localStorage.getItem("updateInfo")) {
			localStorage.setItem("updateInfo", "Context menu will not be created if it is disabled.");
		}
	}
}

//update content js parameter
function updateParameter() {

	//this may not work
	chrome.tabs.getAllInWindow(null, function(tabs) {
		tabs.forEach(function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				method : "updateParameter",
				max : localStorage.getItem("maxZoomLevel"),
				min : localStorage.getItem("minZoomLevel"),
				step : localStorage.getItem("zoomStep")
			}, function(response) {
				//do nothing
			});
		});
	});
}

//init
function initEzZoom() {
	versionControl();
	chrome.extension.onRequest.addListener(requestFromTabs);
	chrome.tabs.onActiveChanged.addListener(setZoomOfCurrentTab);
	chrome.tabs.onUpdated.addListener(setZoomOfCurrentTab);
	createContextMenu();
	setDefaultZoomOnBadge();
};