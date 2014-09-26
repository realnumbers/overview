var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Haltestellen in Y Achse
// Name der Haltestelle, Entfernung vom Startpunkt in m

var stops = [

		{
				"name": "piazza domenicani - Domenikanerplatz",
				"arrivaltime": null,
				"departuretime": {
						"hour": 17,
						"min": 0
				},
				"diff": "0",
				"abs": "0"
		},
		{
				"name": "EURAC",
				"arrivaltime": {
						"hour": 17,
						"min": 2
				},
				"departuretime": {
						"hour": 17,
						"min": 2
				},
				"diff": "1000",
				"abs": "1000"
		},
		{
				"name": "TIS",
				"arrivaltime": {
						"hour": 17,
						"min": 9
				},
				"departuretime": {
						"hour": 17,
						"min": 9
				},
				"diff": "2500",
				"abs": "3500"
		},
		{
				"name": "SEL Ecotherm",
				"arrivaltime": {
						"hour": 17,
						"min": 13
				},
				"departuretime": {
						"hour": 17,
						"min": 13
				},
				"diff": "3000",
				"abs": "6500"
		},
		{
				"name": "SALEWA",
				"arrivaltime": {
						"hour": 17,
						"min": 20
				},
				"departuretime": {
						"hour": 17,
						"min": 20
				},
				"diff": "1000",
				"abs": "7500"
		},
		{
				"name": "IIT",
				"arrivaltime": {
						"hour": 17,
						"min": 23
				},
				"departuretime": {
						"hour": 23,
						"min": 23
				},
				"diff": "2200",
				"abs": "9700"
		},
		{
				"name": "TIS",
				"arrivaltime": {
						"hour": 17,
						"min": 27
				},
				"departuretime": {
						"hour": 17,
						"min": 27
				},
				"diff": "3000",
				"abs": "12700"
		},
		{
				"name": "EURAC",
				"arrivaltime": {
						"hour": 17,
						"min": 35
				},
				"departuretime": {
						"hour": 17,
						"min": 35
				},
				"diff": "2700",
				"abs": "15400"
		},
		{
				"name": "piazza Domenicani",
				"arrivaltime": {
						"hour": 17,
						"min": 38
				},
				"departuretime": null,
				"diff": "1200",
				"abs": "16600"
		}

];

// Liste von Punkten des Diagramms
// Timestamp, Entfernung vom Startpunkt in m
var points = [
	[[14,26,00],13],
	[[14,26,01],22],
	[[14,26,03],31],
	[[14,26,04],44],
	[[14,26,05],52]
]

/*
// Constants
var w;
var h;

var length_mult;
var time_mult;

var time_extra_factor;

var space;

// Visual stuff
var thin;
var thick;
var grid_grey;

// Data
var total_time;
var total_length;
var total_grid_w;
var total_grid_h;

var start_time;

var h = total_grid_h + 2 * space;
var time_mult = total_grid_w / total_time; // multiplier: px/min
*/

function init() {
	alert(window.devicePixelRatio);
	// Constants
	w = canvas.width;
	length_mult = 0.03; // multiplier: px/m

	time_extra_factor = 0.9;

	space = 10; // horizontal space left/right of grid
	text_width = 100;
	tick_length = 10;

	// Data
	total_time = 60;
	total_length = stops[stops.length-1].abs;

	total_grid_w = w - 2 * space - text_width;
	total_grid_h = length_mult * total_length;

	start_time = stops[stops.length-1].departuretime;

	h = total_grid_h + 2 * space;
	time_mult = total_grid_w / total_time; // multiplier: px/min

	// Visual
	thin = 2;
	thick = 3;
	grid_grey = "#bbb";
	grid_dark = "#767676";
}

// Clear the canvas and redraw it every 1000ms
window.setInterval(function(){
	draw();
}, 1000);

function draw() {
	init();
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawTimeGrid();
	drawStopGrid();
}

// Drawing Functions

function drawTimeGrid() {
	for (var i = 0; i < 8; i++) {
		context.beginPath();
		context.moveTo(space + i * time_mult * 10 + text_width, space);
		context.lineTo(space + i * time_mult * 10 + text_width, space + total_grid_h);
		context.lineWidth = thin;
		context.strokeStyle = grid_grey;
		context.stroke();
	}
}

function drawStopGrid() {
	stops.forEach(function(stop, i) {
		lg(stop);

		// horizontal grid lines
		context.beginPath();
		context.moveTo(space + text_width - tick_length, space + stop.abs * length_mult);
		context.lineTo(space + total_grid_w + text_width, space + stop.abs * length_mult);
		context.lineWidth = thin;
		context.strokeStyle = grid_dark;
		context.stroke();

		// stop names
		context.font = "400 9pt 'Fira Sans'";
		context.fillStyle = "#000";
		context.fillText(fittingString(context, stop.name, text_width - space), space, space + stop.abs * length_mult);
	});
}

function maxCanvas() {
	console.log(window.innerWidth);
	canvas.width = window.innerWidth;
	canvas.height = h;
	draw();
}

// EVENTS

window.onload = function(){
	init();
	maxCanvas();
};
window.onresize = function(){
	init();
	maxCanvas();
};


// UTILS
function lg(string) {
	console.log(string);
}

function fittingString(c, str, maxWidth) {
	var width = c.measureText(str).width;
	var ellipsis = '...';
	var ellipsisWidth = c.measureText(ellipsis).width;
	if (width<=maxWidth || width<=ellipsisWidth) {
		return str;
	} else {
		var len = str.length;
		while (width>=maxWidth-ellipsisWidth && len-->0) {
			str = str.substring(0, len);
			width = c.measureText(str).width;
		}
	return str+ellipsis;
	}
}
