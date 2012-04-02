window.addEventListener("keydown", function(event) {

	var element;
	if(event.target) {
		element = event.target;
	} else if(event.srcElement) {
		element = event.srcElement;
	}

	if(element.nodeType == 3) {
		element = element.parentNode;
	}

	//without input tag
	if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
		return;
	}

	if(event.keyCode == 109 || event.keyCode == 189) {// -
		setZoomLevelForContent(parseInt(getZoomLevelFromContent()) - 10);
		sendZoomLevelToBackground(getZoomLevelFromContent());
	} else if(event.keyCode == 106 || event.keyCode == 56) {// *
		setZoomLevelForContent(100);
		sendZoomLevelToBackground(getZoomLevelFromContent());
	} else if(event.keyCode == 107 || event.keyCode == 187) {// +
		setZoomLevelForContent(parseInt(getZoomLevelFromContent()) + 10);
		sendZoomLevelToBackground(getZoomLevelFromContent());
	}
});
updateZoomLevelFromBackground();

var ezZoomTargetElement;
window.addEventListener("mousedown", function(event) {
	ezZoomTargetElement = event.srcElement;
	console.log(ezZoomTargetElement);
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//request from popup (when zoom changed)
	if(request.method == "setZoomLevel") {
		console.log("I GOT" + request.zoomLevel);
		setZoomLevelForContent(request.zoomLevel);
		sendZoomLevelToBackground(getZoomLevelFromContent());
		sendResponse({
			status : null
		});
		//request from bg (zoom target)
	} else if(request.method == "zoomTarget") {
		//35 is magic number
		var windowWidth = parseInt(window.outerWidth) - 35;
		
		//***this may have some problems***
		var targetWidth = parseInt(ezZoomTargetElement.offsetWidth);
		var level = windowWidth / targetWidth;
		document.getElementsByTagName('html')[0].style.zoom = (level * 100) + "%";
		window.scrollTo(ezZoomTargetElement.offsetLeft * level, ezZoomTargetElement.offsetTop * level);
		//***this may have some problems***
		sendResponse({
			status : "ok"
		});
	}
});
function sendZoomLevelToBackground(level) {
	chrome.extension.sendRequest({
		method : "setZoomLevel",
		key : level
	}, function(response) {
		console.log("setZoomLevel:" + response.status);
	});
};

function getZoomLevelFromBackground(callback) {
	chrome.extension.sendRequest({
		method : "getZoomLevel"
	}, function(response) {
		console.log("getZoomLevel:" + response.status);
		callback(response.status);
	});
};

function updateZoomLevelFromBackground() {
	getZoomLevelFromBackground(function(result) {
		if(result === undefined) {
			setZoomLevelForContent("100");
		} else {
			setZoomLevelForContent(result);
		}
	});
};

function getZoomLevelFromContent() {
	console.log("get zoom form content");
	var z = document.getElementsByTagName('html')[0].style.zoom;
	z = z.substring(0, z.length - 1);
	return z;
};

function setZoomLevelForContent(level) {
	if(level > 300) {
		level = 300;
	} else if(level < 10) {
		level = 10;
	}
	console.log("set zoom form content");
	document.getElementsByTagName('html')[0].style.zoom = level + "%";
};