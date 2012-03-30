$(":range").rangeinput();
var zoomObj = $("#zoomlvl").data("rangeinput");

// set current tab's zoom level
chrome.extension.getBackgroundPage().getCurrentTabDomain(
		function(domain) {
			chrome.extension.getBackgroundPage().ezZoom.indexedDB
					.getDomainZoomLevel(domain, function(result) {
						zoomObj.setValue(result);
					});
		})

$("input").keydown(function(event) {
	if (event.keyCode == 13) {	//enter
		zoomObj.setValue(this.value);
		focusInput();
	}
});

$(":range").change(function(event, value) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : zoomObj.getValue()
		}, function(response) {
			// do not thing
		});
	});
	focusInput();
});

$("#zoomInBtn").click(function(event, value) {
	zoomObj.stepDown(10);
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : zoomObj.getValue()
		}, function(response) {
			// do not thing
		});
	});
	focusInput();
});

$("#zoomResetBtn").click(function(event, value) {
	zoomObj.setValue(100);
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : "100"
		}, function(response) {
			// do not thing
		});
	});
	focusInput();
});

$("#zoomOutBtn").click(function(event, value) {
	zoomObj.stepUp(10);
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : zoomObj.getValue()
		}, function(response) {
			// do not thing
		});
	});
	focusInput();
});
var focusInput = function() {
	$("input[type='text']:first").focus().select();
}

focusInput();