$(":range").rangeinput();
var zoomObj = $("#zoomlvl").data("rangeinput");

$(":range").change(function(event, value) {

});

$(":range").onSlide(function(event, value) {

});

$("#zoomInBtn").click(function(event, value) {
	zoomObj.stepDown(10);
});
$("#zoomOutBtn").click(function(event, value) {
	zoomObj.stepUp(10);
});