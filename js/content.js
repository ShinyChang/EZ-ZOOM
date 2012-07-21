document.addEventListener("keydown", function(event) {

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
		ezZoom.setZoomLevelForContent(parseInt(ezZoom.getZoomLevelFromContent()) - parseInt(ezZoom.zoomStep));
		ezZoom.sendZoomLevelToBackground(ezZoom.getZoomLevelFromContent());
	} else if(event.keyCode == 106 || event.keyCode == 56) {// *
		ezZoom.setZoomLevelForContent(100);
		ezZoom.sendZoomLevelToBackground(ezZoom.getZoomLevelFromContent());
	} else if(event.keyCode == 107 || event.keyCode == 187) {// +
		ezZoom.setZoomLevelForContent(parseInt(ezZoom.getZoomLevelFromContent()) + parseInt(ezZoom.zoomStep));
		ezZoom.sendZoomLevelToBackground(ezZoom.getZoomLevelFromContent());
	}
});
var ezZoom = {
    defaultZoom : 100,
	max : 300,
	min : 10,
	zoomStep : 10,
	ezZoomTargetElement : null,
	sendZoomLevelToBackground : function(level) {
		chrome.extension.sendRequest({
			method : "setZoomLevel",
			key : level
		}, function(response) {
			// do nothing
		});
	},
	getZoomLevelFromBackground : function(callback) {
		chrome.extension.sendRequest({
			method : "getZoomLevel"
		}, function(response) {
			callback(response.status);
		});
	},
	updateZoomLevelFromBackground : function() {
		this.getZoomLevelFromBackground(function(result) {
			if(result === undefined) {
			    console.log(ezZoom.defaultZoom);
				ezZoom.setZoomLevelForContent(ezZoom.defaultZoom);
			} else {
				ezZoom.setZoomLevelForContent(result);
			}
		});
	},
	getZoomLevelFromContent : function() {
		var z = document.getElementsByTagName('html')[0].style.zoom;
		z = z.substring(0, z.length - 1);
		if(z === "") {
			z = ezZoom.defaultZoom;
		}
		return z;
	},
	setZoomLevelForContent : function(level) {
		if(parseInt(level) > this.max) {
			level = this.max;
		} else if(parseInt(level) < this.min) {
			level = this.min;
		}
		document.getElementsByTagName('html')[0].style.zoom = level + "%";
	},
	updateParameter : function() {
		chrome.extension.sendRequest({
			method : "getParameter"
		}, function(response) {
		    ezZoom.defaultZoom = response.defaultZoom;
			ezZoom.max = response.max;
			ezZoom.min = response.min;
			ezZoom.zoomStep = response.step;
			ezZoom.updateZoomLevelFromBackground();
		});
	},
	init : function() {
		this.updateParameter();
	}
};
document.addEventListener("mousedown", function(event) {
	ezZoom.ezZoomTargetElement = event.srcElement;
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	//request from popup (when zoom changed)
	if(request.method === "setZoomLevel") {
		ezZoom.setZoomLevelForContent(request.zoomLevel);
		ezZoom.sendZoomLevelToBackground(ezZoom.getZoomLevelFromContent());
		sendResponse({
			status : null
		});
		//request from bg (zoom target)
	} else if(request.method === "zoomTarget") {

		//35 is magic number
		var windowWidth = parseInt(window.outerWidth) - 35;

		//***this may have some problems***
		var targetWidth = parseInt(ezZoom.ezZoomTargetElement.offsetWidth);
		var level = windowWidth / targetWidth;
		document.getElementsByTagName('html')[0].style.zoom = (level * 100) + "%";
		window.scrollTo(ezZoom.ezZoomTargetElement.offsetLeft * level, ezZoom.ezZoomTargetElement.offsetTop * level);
		//***this may have some problems***

		sendResponse({
			status : "ok"
		});
		//request from option page (update parameter)
	} else if(request.method === "updateParameter") {
	    ezZoom.defaultZoom = request.defaultZoom;
		ezZoom.max = request.max;
		ezZoom.min = request.min;
		ezZoom.zoomStep = request.step;
	}
});

ezZoom.init();
