function onKeyDown(event) {
	//48~57 96~105 110 190
	if(event.keyCode == 13) {//enter
		$("#slider").slider("value", this.value);
	}
};

function onZoomIn(event, value) {
	$("#slider").slider("value", parseInt($("#slider").slider("value")) + 10);
};

function onZoomReset(event, value) {
	$("#slider").slider("value", 100);
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : "100"
		}, function(response) {
			// do nothing
		});
	});
};

function focusInput() {
	$("input[type='text']:first").select().focus();
}

function onZoomOut(event, value) {
	$("#slider").slider("value", parseInt($("#slider").slider("value")) - 10);
};

// set current tab's zoom level
function setCurrentTabsZoomLevel() {
	chrome.extension.getBackgroundPage().getCurrentTabDomain(function(domain) {
		chrome.extension.getBackgroundPage().ezZoom.indexedDB.getDomainZoomLevel(domain, function(result) {
			if(result != undefined) {
				$("#amount").val(result);
				$("#slider").slider("value", result);
			}
		});
	});
};

function updateZoom() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method : "setZoomLevel",
			zoomLevel : $("#slider").slider("value")
		}, function(response) {
			// do nothing
		});
	});
	$("#amount").val($("#slider").slider("value"));
	focusInput();
}

function initPopup() {
	$("#slider").slider({
		range : "max",
		min : 10,
		max : 300,
		value : 100,
		slide : function(event, ui) {
			$("#amount").val(ui.value);
		},
		change : updateZoom
	});
	setCurrentTabsZoomLevel();
	$("input[type='text']:first").keydown(onKeyDown);
	$("#zoomInBtn").click(onZoomIn);
	$("#zoomResetBtn").click(onZoomReset);
	$("#zoomOutBtn").click(onZoomOut);
	focusInput();
};