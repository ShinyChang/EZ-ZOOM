window.addEventListener("keydown", function(event) { 
	var element;
	if (event.target) {
		element = event.target;
	} else if (event.srcElement) {
		element=event.srcElement;
	}

	if (element.nodeType == 3) {
		element=element.parentNode;
	}

	if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
		return;
	}
	var zoom = document.getElementsByTagName('html')[0].style.zoom;
	zoom = zoom.substring(0, zoom.length - 1);
	if (zoom == '') {
		zoom = 100;
	}
	if (event.keyCode == 109 ){// -
		zoom -= 10;
		if (zoom < 10) {
			zoom = 10;
		}
		document.getElementsByTagName('html')[0].style.zoom = zoom + '%';
	}
	else if (event.keyCode == 106 ){// *
		document.getElementsByTagName('html')[0].style.zoom = '100%';
	}
	else if (event.keyCode == 107 ){// +
		zoom =  parseInt(zoom) +  parseInt(10);
		if (zoom > 300) {
			zoom = 300;
		}
		document.getElementsByTagName('html')[0].style.zoom = zoom + '%';
	}
});