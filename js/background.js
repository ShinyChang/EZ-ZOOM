// get current tab's domain
function getCurrentTabDomain(callback) {
	chrome.tabs.getSelected(null, function(tab) {
		callback(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1]);
	});
};

// handle request which is from context or popup page
function requestFromTabs(obj, sneder, sendResponse) {

	switch(obj.method) {
		//update database trigger by context or popup page
		case "setZoomLevel":
			//update extension badge
			chrome.browserAction.setBadgeText({
				text : obj.key
			});

			//get current tab's domain and update database
			chrome.tabs.getSelected(null, function(tab) {

				//indexDB function
				ezZoom.indexedDB.addDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], obj.key);
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
			chrome.storage.sync.get(["defaultZoomLevel", "minZoomLevel", "maxZoomLevel", "zoomStep"], function(o){
				//response
				sendResponse({
					defaultZoom : o.defaultZoomLevel, 
					max : o.maxZoomLevel,
					min : o.minZoomLevel,
					step : o.zoomStep
				});
				return true;
			});
			break;
	}
	return true;
};

//set current tab's zoom level
function setZoomOfCurrentTab(tabId, selectInfo) {

	// get current tab
	chrome.tabs.getSelected(null, function(tab) {


		chrome.storage.sync.get("defaultZoomLevel", function(o) {
			//query domain zoom level
			ezZoom.indexedDB.getDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], function(result) {

				//set default zoom level when current tab never zoomed or can not zoom
				if(result === undefined) {
					result = o.defaultZoomLevel;
				}

				//update extension badge
				chrome.browserAction.setBadgeText({
					text : result
				});
			});
		});
	});
};

//default zoom level badge
function setDefaultZoomOnBadge() {
	chrome.storage.sync.get("defaultZoomLevel", function(o) {
		chrome.browserAction.setBadgeText({
			text : o.defaultZoomLevel
		});
	});
};

//create context menu
function createContextMenu() {
	chrome.storage.sync.get("contextMenu", function(o) {
		if(o.contextMenu === "checked") {
			ezZoomContextMenu.create();
		}
	});
};

//remove context menu
function destoryContextMenu() {
	chrome.contextMenus.removeAll();
}

//control the version of ezZoom
function versionControl() {
	chrome.storage.sync.get("EZZoomVersion", function(o) {
		if(o.EZZoomVersion !== "1.7.1") {
			chrome.storage.sync.set({"EZZoomVersion": "1.7.1"});
			chrome.storage.sync.remove("updateInfo");

			//default parameter by chrome storage api
			chrome.storage.sync.get(["defaultZoomLevel", "minZoomLevel", "maxZoomLevel", "zoomStep", "contextMenu", "updateInfo"], function(obj){
				if(!obj.defaultZoomLevel) {
					chrome.storage.sync.set({"defaultZoomLevel": "100"});
				}
				if(!obj.minZoomLevel) {
					chrome.storage.sync.set({"minZoomLevel": "10"});
				}
				if(!obj.maxZoomLevel) {
					chrome.storage.sync.set({"maxZoomLevel": "300"});
				}			
				if(!obj.zoomStep) {
					chrome.storage.sync.set({"zoomStep": "10"});
				}	
				if(!obj.contextMenu) {
					chrome.storage.sync.set({"contextMenu": "checked"});
				}
				if(!obj.updateInfo) {
					chrome.storage.sync.set({"updateInfo": chrome.i18n.getMessage("update_info_message")});
				}			
			});			
		}
	});
}

//update content js parameter
function updateParameter() {

	//this may not work
	chrome.tabs.getAllInWindow(null, function(tabs) {
		chrome.storage.sync.get(["defaultZoomLevel", "minZoomLevel", "maxZoomLevel", "zoomStep"], function(o){
			tabs.forEach(function(tab) {
				chrome.tabs.sendMessage(tab.id, {
					method : "updateParameter",
					defaultZoom : o.defaultZoomLevel, 
					max : o.maxZoomLevel,
					min : o.minZoomLevel,
					step : o.zoomStep
				});
			});
		});
	});
}

//init
function initEzZoom() {
	versionControl();
	chrome.extension.onMessage.addListener(requestFromTabs);
	chrome.tabs.onActiveChanged.addListener(setZoomOfCurrentTab);
	chrome.tabs.onUpdated.addListener(setZoomOfCurrentTab);
	createContextMenu();
	setDefaultZoomOnBadge();
};

//Main function
$(function() {
	initIndexDB();
	initEzZoom();
});

