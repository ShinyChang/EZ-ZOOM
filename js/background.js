function getCurrentTabDomain(callback) {
    console.log("get current tab\'s domain");
    chrome.tabs.getSelected(null, function(tab) {
        callback(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1]);
    });
};

function requestFromTabs(request, sender, sendResponse) {
	if(request.method == "setZoomLevel") {
        chrome.browserAction.setBadgeText({
            text : request.key
        });
        console.log("set zoom:" + request.key);
        chrome.tabs.getSelected(null, function(tab) {
            addDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], request.key);
        });
        sendResponse({
            status : "ok"
        });
    } else if(request.method == "getZoomLevel") {
        chrome.tabs.getSelected(null, function(tab) {
            ezZoom.indexedDB.getDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], function(result) {
                sendResponse({
                    status : result
                });
            });
        });
    }
};

function setZoomOfCurrentTab(tabId, selectInfo) {
    console.log("tab changed");
    chrome.tabs.getSelected(null, function(tab) {
        ezZoom.indexedDB.getDomainZoomLevel(tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1], function(result) {
            console.log("tab zoom level:" + result);
			if(result === undefined) {
				result = "100";
			}
            chrome.browserAction.setBadgeText({
                text : result
            });
        });
    });	
};

function setDefaultZoomOnBadge(){
	chrome.browserAction.setBadgeText({
	    text : "100"
	});
};


function initEzZoom() {
	chrome.extension.onRequest.addListener(requestFromTabs);	
	chrome.tabs.onActiveChanged.addListener(setZoomOfCurrentTab);	
	setDefaultZoomOnBadge();
};
