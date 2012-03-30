function InsertFunc(tabId, changeInfo, tab) {
	if (changeInfo.status == "complete") {
		chrome.tabs.executeScript(null, { file: "content.js"} );
	}
};

//request from tabs
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getZoom") {
		chrome.browserAction.setBadgeText({text: request.key});
		console.log("set zoom:"+request.key);
		//TO-DO, it dose not do anything now
		if (!localStorage.getItem(request.key) === null) {
			sendResponse({status: "100"});
		} else {
			sendResponse({status: request.key});
		}
	} else {
		//TO-DO, it dose not do anything now
		sendResponse({}); // snub them.
	}
});

//tabs active change event
chrome.tabs.onActiveChanged.addListener(function(tabId, selectInfo) {

	//get info from active tab
	chrome.tabs.sendRequest(tabId, {method: "getStatus"}, function(response) {
		chrome.browserAction.setBadgeText({text: response.status});
		console.log("set badge:" + response.status);
	});
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(InsertFunc);
chrome.browserAction.setBadgeText({text: "100"});
console.log("EZ Zoom is ready.");