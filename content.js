window.addEventListener("keydown", function(event) { 

	var element;
	if (event.target) {
		element = event.target;
	} else if (event.srcElement) {
		element = event.srcElement;
	}

	if (element.nodeType == 3) {
		element = element.parentNode;
	}
	
	//without input tag
	if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
		return;
	}


	//init localstorage["EZZOOM"]
	if(localStorage.getItem("EZZOOM") != null) {
		zoom = localStorage.getItem("EZZOOM");	
	} else {
		zoom = document.getElementsByTagName('html')[0].style.zoom;
		zoom = zoom.substring(0, zoom.length - 1);
		if (zoom == '') {
			zoom = 100;
		}
		localStorage.setItem("EZZOOM", zoom);
	}

	//key event handle
	if (event.keyCode == 109 || event.keyCode == 189 ){// -
		zoom -= 10;
		if (zoom < 10) {
			zoom = 10;
		}
		document.getElementsByTagName('html')[0].style.zoom = zoom + '%';
		localStorage.setItem("EZZOOM", zoom);
	}
	else if (event.keyCode == 106 || event.keyCode == 56 ){// *
		zoom = 100;
		document.getElementsByTagName('html')[0].style.zoom = '100%';
		localStorage.setItem("EZZOOM", zoom);
	}
	else if (event.keyCode == 107 || event.keyCode == 187 ){// +
		zoom =  parseInt(zoom) +  parseInt(10);
		if (zoom > 300) {
			zoom = 300;
		}
		document.getElementsByTagName('html')[0].style.zoom = zoom + '%';
		localStorage.setItem("EZZOOM", zoom);
	}

	//send zoom info to bg
	chrome.extension.sendRequest({method: "getZoom", key: localStorage.getItem("EZZOOM")}, function(response) {
		console.log("EZ ZOOM: " + response.status);
	});
});

//set default zoom size
document.getElementsByTagName('html')[0].style.zoom = localStorage.getItem("EZZOOM") + '%';

//send zoom info to bg
chrome.extension.sendRequest({method: "getZoom", key: localStorage.getItem("EZZOOM")}, function(response) {
	console.log("EZ ZOOM:"+response.status);
});


//request from bg
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log("get from bg");
    if (request.method == "getStatus") {
		sendResponse({status: localStorage.getItem("EZZOOM")});
    } else {
		sendResponse({}); // snub them.
	}
});