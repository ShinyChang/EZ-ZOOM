$(function() {
	initIndexDB();
	var background_page = chrome.extension.getBackgroundPage();
	
	//update info
	if(localStorage.getItem("updateInfo")) {
		$("#infoDiv").append(localStorage.getItem("updateInfo")).alert();
		$("#infoDiv").bind("close", function(){
			localStorage.removeItem("updateInfo");
		});
	} else {
		$("#infoDiv").hide();
	}
	
	//set attribute by chrome storage api
	chrome.storage.sync.get(["defaultZoomLevel", "minZoomLevel", "maxZoomLevel", "zoomStep", "contextMenu"], function(obj){
		$("#defaultZoom").val(obj.defaultZoomLevel);
		$("#minimumZoomInput").val(obj.minZoomLevel);
		$("#maximumZoomInput").val(obj.maxZoomLevel);
		$("#zoomStepInput").val(obj.zoomStep);
		$("input:checkbox").attr("checked", obj.contextMenu === "checked");		
	});


	//form submit
	$("form").submit(function() {

		// sync by chrome storage api
		chrome.storage.sync.set({
			"defaultZoomLevel": $("#defaultZoom").val(),
			"minZoomLevel": $("#minimumZoomInput").val(),
			"maxZoomLevel": $("#maximumZoomInput").val(),
			"zoomStep": $("#zoomStepInput").val(),
			"contextMenu":  $("input:checkbox").attr("checked")
		});

		// enable/disable context menu
		if($("input:checkbox").attr("checked") === "checked") {
			background_page.createContextMenu();
		} else {
			background_page.destoryContextMenu();
		}
		background_page.updateParameter();
	});
});
