var ezZoomParameter = {
	max : 300,
	min : 10,
	step : 10
};

function onKeyDown(event) {
	//48~57 96~105 110 190
	if(event.keyCode == 13) {//enter
		$("#slider").slider("value", this.value);
	}
};

function onZoomIn(event, value) {
	$("#slider").slider("value", parseInt($("#slider").slider("value")) + parseInt(ezZoomParameter.step));
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
	$("#slider").slider("value", parseInt($("#slider").slider("value")) - parseInt(ezZoomParameter.step));
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
};

//updata zoom parameter
function updateParameter() {
	chrome.extension.sendRequest({
		method : "getParameter"
	}, function(response) {
		ezZoomParameter.max = response.max;
		ezZoomParameter.min = response.min;
		ezZoomParameter.step = response.step;
		
		//update slider parameter
		$('#slider').slider('option', 'max', parseInt(ezZoomParameter.max))
		$('#slider').slider('option', 'min', parseInt(ezZoomParameter.min))
		$('#slider').slider('value', $('#amount').val());
	});
};

function initPopup() {
	$("#slider").slider({
		range : "max",
		min : ezZoomParameter.min,
		max : ezZoomParameter.max,
		value : 100,
		slide : function(event, ui) {
			$("#amount").val(ui.value);
		},
		change : updateZoom,
		create : updateParameter
	});

	$("input[type='text']:first").keydown(onKeyDown);
	$("#zoomInBtn").click(onZoomIn);
	$("#zoomResetBtn").click(onZoomReset);
	$("#zoomOutBtn").click(onZoomOut);
	setCurrentTabsZoomLevel();
	focusInput();
};