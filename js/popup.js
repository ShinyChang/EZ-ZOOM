var ezZoomParameter = {
	defaultZoom : 100,
	max : 300,
	min : 10,
	step : 10
};

//Main function
$(function() {
	initPopup();
});

//key down event function
function onKeyDown(event) {
	//48~57 96~105 110 190
	if(event.keyCode == 13) {//enter
		$("#slider").slider("value", this.value);
	}
};

//zoom in event function
function onZoomIn(event, value) {
	$("#slider").slider("value", parseInt($("#slider").slider("value")) + parseInt(ezZoomParameter.step));
};

//zoom out event function
function onZoomOut(event, value) {
	$("#slider").slider("value", parseInt($("#slider").slider("value")) - parseInt(ezZoomParameter.step));
};

//zoom reset event function
function onZoomReset(event, value) {
	$("#slider").slider("value", ezZoomParameter.defaultZoom);
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {
			method : "setZoomLevel",
			zoomLevel : ezZoomParameter.defaultZoom
		}, function(response) {
			// do nothing
		});
	});
};

function focusInput() {
	$("input[type='text']:first").select().focus();
}

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
		chrome.tabs.sendMessage(tab.id, {
			method : "setZoomLevel",
			zoomLevel : $("#slider").slider("value")
		}, function(response) {
			// do nothing
		});
	});
	$("#amount").val($("#slider").slider("value"));
	focusInput();
};

//update zoom parameter
function updateParameter() {
	chrome.extension.sendMessage({
		method : "getParameter"
	}, function(response) {
		ezZoomParameter.defaultZoom = response.defaultZoom;
		ezZoomParameter.max = response.max;
		ezZoomParameter.min = response.min;
		ezZoomParameter.step = response.step;
		
		//update slider parameter
		$('#slider').slider('option', 'max', parseInt(ezZoomParameter.max))
		$('#slider').slider('option', 'min', parseInt(ezZoomParameter.min))
	});
};

function openOptionPage() {
	chrome.tabs.create({
		'url': chrome.extension.getURL('option.html')
	}, function(tab) {

	});
}

function initPopup() {
	$("#slider").slider({
		range : "max",
		min : ezZoomParameter.min,
		max : ezZoomParameter.max,
		value : ezZoomParameter.defaultZoom,
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
	$("#optionBtn").click(openOptionPage);
	setCurrentTabsZoomLevel();
	focusInput();
};