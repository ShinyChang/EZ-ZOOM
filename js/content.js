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

//request from bg (when tab switched)
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.method == "setZoomLevel") {
        console.log(request.zoomLevel);
        setZoomLevelForContent(request.zoomLevel);
        localStorage.setItem("EZZOOM", request.zoomLevel);
        sendZoomLevelToBackground(getZoomLevelFromContent());
		sendResponse({
            status : null
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
    } else if(level <10) {
        level = 10;
    }
    console.log("set zoom form content");
    document.getElementsByTagName('html')[0].style.zoom = level + "%";
};