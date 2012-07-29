$(function() {
	initPage();
	initIndexDB();
	var background_page = chrome.extension.getBackgroundPage();

	//init page text
	function initPage() {
		$("#option_page_title").html(loadMsg("option_page_title"));
		$("#update_information_title").html(loadMsg("update_information_title"));
		$("#default_zoom_size").html(loadMsg("default_zoom_size"));
		$("#system_parameter_title").html(loadMsg("system_parameter_title"));
		$("#minimum_zoom_size").html(loadMsg("minimum_zoom_size"));
		$("#maximum_zoom_size").html(loadMsg("maximum_zoom_size"));
		$("#zoom_step").html(loadMsg("zoom_step"));
		$("#context_menu").html(loadMsg("context_menu"));
		$("#enable_text").html(loadMsg("enable_text"));
		$("#save_text").html(loadMsg("save_text"));
		$("#cancel_text").html(loadMsg("cancel_text"));
		$("#hotkeys_title").html(loadMsg("hotkeys_title"));
		$("#zoom_in_text").html(loadMsg("zoom_in_text"));
		$("#zoom_out_text").html(loadMsg("zoom_out_text"));
		$("#zoom_reset_text").html(loadMsg("zoom_reset_text"));
		$("#database_title").html(loadMsg("database_title"));
		$("#warning_title").html(loadMsg("warning_title"));
		$("#warning_message").html(loadMsg("warning_message"));
		$("#domain_text").html(loadMsg("domain_text"));
		$("#zoom_text").html(loadMsg("zoom_text"));
		$("#option_text").html(loadMsg("option_text"));
		$("#back_to_top").html(loadMsg("back_to_top"));
	}

	function loadMsg(msg) {
		return chrome.i18n.getMessage(msg);
	}

	
	//update info
	chrome.storage.sync.get("updateInfo", function(o){
		if(o.updateInfo) {
			$("#infoDiv").append(o.updateInfo).alert();
			$("#infoDiv").bind("close", function(){
				chrome.storage.sync.remove("updateInfo");
			});
		} else {
			$("#infoDiv").hide();
		}		
	});

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
			"contextMenu":  $("input:checkbox").attr("checked") === "checked" ? "checked" : "undefined"
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
