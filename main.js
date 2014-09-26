var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Haltestellen in Y Achse
// Name der Haltestelle, Entfernung vom Startpunkt in m
[
	["Haltestelle", 0],
	["Haltestelle", 54],
	["Haltestelle", 121],
	["Haltestelle", 134]
]

// Liste von Punkten des Diagramms
// Timestamp in s, Entfernung vom Startpunkt in m
[
	[0,13],
	[2,22],
	[4,31],
	[6,44],
	[8,52],
	[10,68],
	[12,73]
]

// Constants
var date;
var h;
var m;
var s;
var dist60 = 8;
var dist24 = 20;
var dist12 = 40;
var leftd = 40;
var topd = 50;
var rowd = 80;
var len = 16;
var thin = 2;
var thick = 3;
var important = "#000";
var unimportant = "#bbb";
var accent = "#fd3301";

// Clear the canvas and redraw it every 1000ms
window.setInterval(function(){
	date = new Date();
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawGrid(0, 24, 1, dist24, unimportant, thin);
	drawGrid(0, 5, 6, dist24, important, thin);

	drawGrid(1, 12, 1, dist12, unimportant, thin);
	drawGrid(1, 5, 3, dist12, important, thin);

	drawGrid(2, 12, 1, dist12, unimportant, thin);
	drawGrid(2, 5, 3, dist12, important, thin);

	drawTime(0, h, dist24, m/60 * dist24, accent, thick);
	drawTime(1, m, dist60, s/60 * dist60, accent, thick);
	drawTime(2, s, dist60, 0, accent, thick);
}, 1000);

// Drawing Functions

function drawGrid(row, ticks, gap, dist, color, width) {
	for (var i = 0; i < ticks; i++) {
		context.beginPath();
		context.moveTo(leftd + i * gap * dist, topd + rowd * row);
		context.lineTo(leftd + i * gap * dist, topd + len + rowd * row);
		context.lineWidth = width;
		context.strokeStyle = color;
		context.stroke();
	}
}

function drawTime(row, val, dist, disp, color, width) {
	context.beginPath();
	context.moveTo(leftd + val * dist + disp, topd + rowd * row);
	context.lineTo(leftd + val * dist + disp, topd + len + rowd * row);
	context.lineWidth = thick;
	context.strokeStyle = color;
	context.stroke();

	context.font = "bold 18pt Helvetica";
	context.fillStyle = color;
	var offset = 14;
	if (val < 10) {
		offset = 6;
	}
	context.fillText(val, (leftd + val * dist + disp) - offset, 40 + rowd * row);
}
