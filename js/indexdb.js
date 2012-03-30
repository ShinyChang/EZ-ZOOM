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
    console.log("EZZOOM indexDB error:" + e);
};

ezZoom.indexedDB.open = function() {
    var request = indexedDB.open("domainZoomLevel");

    request.onsuccess = function(e) {
        var v = "1.00";
        ezZoom.indexedDB.db = e.target.result;
        var db = ezZoom.indexedDB.db;
        // We can only create Object stores in a setVersion transaction;
        if(v != db.version) {
            var setVrequest = db.setVersion(v);

            // onsuccess is the only place we can create Object Stores
            setVrequest.onerror = ezZoom.indexedDB.onerror;
            setVrequest.onsuccess = function(e) {
                if(db.objectStoreNames.contains("domainZoomLevel")) {
                    db.deleteObjectStore("domainZoomLevel");
                }

                var store = db.createObjectStore("domainZoomLevel", null);
                ezZoom.indexedDB.getAllDomainZoomLevelItems();
            };
        } else {
            ezZoom.indexedDB.getAllDomainZoomLevelItems();
        }
    };

    request.onerror = ezZoom.indexedDB.onerror;
}

ezZoom.indexedDB.addDomainZoomLevel = function(domain, zoomLevel) {
    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["domainZoomLevel"], IDBTransaction.READ_WRITE);
    var store = trans.objectStore("domainZoomLevel");

    var request = store.put(zoomLevel, domain);

    request.onsuccess = function(e) {
        console.log("add successful");
        ezZoom.indexedDB.getAllDomainZoomLevelItems();
    };

    request.onerror = function(e) {
        console.log("Error Adding: ", e);
    };
};

ezZoom.indexedDB.deleteDomainZoomLevel = function(id) {
    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["domainZoomLevel"], IDBTransaction.READ_WRITE);
    var store = trans.objectStore("domainZoomLevel");
    var request = store.
    delete (id);

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
    var trans = db.transaction(["domainZoomLevel"], IDBTransaction.READ_WRITE);
    var store = trans.objectStore("domainZoomLevel");

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false) {
            return;
        }
        renderDomainZoomLevel(result);
        result.
        continue();
    };
    
    

    cursorRequest.onerror = ezZoom.indexedDB.onerror;
};

ezZoom.indexedDB.getDomainZoomLevel = function(domain, callback) {
    var db = ezZoom.indexedDB.db;
    var trans = db.transaction(["domainZoomLevel"], IDBTransaction.READ_WRITE);
    var store = trans.objectStore("domainZoomLevel");
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

function addDomainZoomLevel(domain, zoomLevel) {
    ezZoom.indexedDB.addDomainZoomLevel(domain, zoomLevel);
};




function init() {
    ezZoom.indexedDB.open();
};

window.addEventListener("DOMContentLoaded", init, false);


