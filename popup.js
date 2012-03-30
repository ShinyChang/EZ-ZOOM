$(":range").rangeinput();
var zoomObj = $("#zoomlvl").data("rangeinput");

//set current tab's zoom level
chrome.extension.getBackgroundPage().getCurrentTabDomain(function(domain) {
    chrome.extension.getBackgroundPage().ezZoom.indexedDB.getDomainZoomLevel(domain, function(result) {
        zoomObj.setValue(result);
    });
})


$(":range").change(function(event, value) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {
            method : "setZoomLevel",
            zoomLevel : zoomObj.getValue()
        }, function(response) {
            // do not thing
        });
    });
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
});

