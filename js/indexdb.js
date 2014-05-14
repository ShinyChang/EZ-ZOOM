/**
 * @author Shiny
 */
var ezZoom = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

//chrome browser
if('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
}

ezZoom.indexedDB = {};
ezZoom.indexedDB.db = null;

ezZoom.indexedDB.onerror = function(e) {
    console.log("EZZOOM indexDB error");
    console.log(e);
};

ezZoom.indexedDB.open = function() {
    console.log('open')
    var request = indexedDB.open("ezzoom");
    request.onsuccess = function(e) {
        ezZoom.indexedDB.db = request.result;
        ezZoom.indexedDB.getAllDomainZoomLevelItems();
    };
    request.onupgradeneeded  = function(e) {
        var db = e.target.result;
        db.createObjectStore("ezzoom", null);
    };

    request.onerror = ezZoom.indexedDB.onerror;
}

ezZoom.indexedDB.addDomainZoomLevel = function(domain, zoomLevel) {
    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["ezzoom"], "readwrite");
    var store = trans.objectStore("ezzoom");
    var request = store.put(zoomLevel, domain);
    request.onsuccess = function(e) {
        ezZoom.indexedDB.getAllDomainZoomLevelItems();
    };
    request.onerror = function(e) {
        console.log("Error Adding: ", e);
    };
};

ezZoom.indexedDB.deleteDomainZoomLevel = function(id) {
    var db = ezZoom.indexedDB.db;

    var trans = db.transaction(["ezzoom"], "readwrite");
    var store = trans.objectStore("ezzoom");
    var request = store.delete(id);
    request.onsuccess = function(e) {
        ezZoom.indexedDB.getAllDomainZoomLevelItems();
    };
    request.onerror = function(e) {
        console.log("Error Adding: ", e);
    };
};

ezZoom.indexedDB.getAllDomainZoomLevelItems = function() {
	$("#domainZoomLevelContainer tbody").html("");	//clear tbody

    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["ezzoom"], "readwrite");
    var store = trans.objectStore("ezzoom");

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false) {
            return;
        }
        renderDomainZoomLevel(result);
        result.continue();
    };
	cursorRequest.onerror = ezZoom.indexedDB.onerror;
};

ezZoom.indexedDB.getDomainZoomLevel = function(domain, callback) {
    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["ezzoom"], "readwrite");
    var store = trans.objectStore("ezzoom");
    var request = store.get(domain);
    request.onsuccess = function(e) {
        callback(e.target.result);
    };
};

function renderDomainZoomLevel(row) {
	$("#domainZoomLevelContainer tbody").append('<tr><td>'+row.key+'</td><td>'+row.value+'</td><td><i class="icon-remove"></i></td></tr>');
	$("#domainZoomLevelContainer i:last").click(function(){
		var domain = $(this).parent('td').prevAll("td").last().html();
		ezZoom.indexedDB.deleteDomainZoomLevel(domain);
	});
};

function initIndexDB() {
    ezZoom.indexedDB.open();
};