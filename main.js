var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// Haltestellen in Y Achse
// Name der Haltestelle, Entfernung vom Startpunkt in m
var ratio = 1;
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
	// Constants
	w =  canvas.width / ratio;
	length_mult = 0.03; // multiplier: px/m

	time_extra_factor = 0.9;

	space = 15; // horizontal space left/right of grid
	top_space = 40;
	text_width = 100;
	tick_length = 10;

	// Data
	total_time = 60;
	total_length = stops[stops.length-1].abs;

	total_grid_w = w - 2 * space - text_width;
	total_grid_h = length_mult * total_length;

	start_min = stops[0].departuretime.min - (stops[0].departuretime.min) % 10;
	start_hour = stops[0].departuretime.hour;

	time_offset_graph = (stops[0].departuretime.min) % 10;

	h = total_grid_h + 2 * top_space;
	time_mult = total_grid_w / total_time; // multiplier: px/min

	// Visual
	thin = 2;
	thick = 3;
	grid_grey = "#bbb";
	grid_dark = "#555";
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
	drawBus();
}

// Drawing Functions

function drawTimeGrid() {
	for (var i = 0; i < 8; i++) {
		// long grey lines
		context.beginPath();
		context.moveTo(space + i * time_mult * 10 + text_width, top_space);
		context.lineTo(space + i * time_mult * 10 + text_width, top_space + total_grid_h);
		context.lineWidth = thin;
		context.strokeStyle = (i == 0 || i == 6)?grid_dark:grid_grey;
		context.stroke();

		// small black ticks
		context.beginPath();
		context.moveTo(space + i * time_mult * 10 + text_width, top_space - tick_length);
		context.lineTo(space + i * time_mult * 10 + text_width, top_space);
		context.lineWidth = thin;
		context.strokeStyle = grid_dark;
		context.stroke();

		// time text
		var mins = (i < 6)?(start_min + i * 10):0;
		var hours = (i < 6)?start_hour:start_hour + 1;
		var time_format = ((hours < 10)? "0" + hours : hours) + ":" + ((mins < 10)? "0" + mins : mins);

		context.font = "500 8pt 'Fira Sans'";
		context.fillStyle = "#000";
		context.textAlign="right";
		context.fillText(time_format, space + text_width + i * time_mult * 10 + 13, top_space - 20);
	}
}

function drawStopGrid() {
	stops.forEach(function(stop, i) {

		// horizontal grid lines
		context.beginPath();
		context.moveTo(space + text_width - tick_length, top_space + stop.abs * length_mult);
		context.lineTo(space + total_grid_w + text_width, top_space + stop.abs * length_mult);
		context.lineWidth = thin;
		context.strokeStyle = grid_dark;
		context.stroke();

		// stop names
		context.font = "400 9pt 'Fira Sans'";
		context.fillStyle = "#000";
		context.textAlign="right";
		context.fillText(fittingString(context, stop.name, text_width - space), text_width - space/2, top_space + stop.abs * length_mult);
	});
}

function drawBus() {
	stops.forEach(function(stop, i) {
		lg(stop);

		var left_offset = space + text_width + time_offset_graph;
		var top_offset = top_space;

		if (i != 0) {
			var dep = stops[i-1];
			var arr = stop;

			var dep_left = (dep.departuretime.hour * 60 + dep.departuretime.min) * time_mult;
			var dep_top = dep.abs * length_mult;

			var arr_left = (arr.arrivaltime.hour * 60 + arr.arrivaltime.min) * time_mult;
			var arr_top = arr.abs * length_mult;

			// horizontal grid lines
			context.beginPath();
			context.moveTo(left_offset + dep_left, top_space + dep_top);
			context.lineTo(left_offset + arr_left, top_space + arr_top);
			context.lineWidth = thick;
			context.strokeStyle = "red";
			context.stroke();
		}
		if (i != stops.length-1) {
			var dep = stops[i-1];
			var arr = stop;
			lg(i-1);
			var dep_left = (dep.arrivaltime.hour * 60 + dep.arrivaltime.min) * time_mult;
			var dep_top = dep.abs * length_mult;

			var arr_left = (arr.departuretime.hour * 60 + arr.departuretime.min) * time_mult;
			var arr_top = dep.abs * length_mult;

			// horizontal grid lines
			context.beginPath();
			context.moveTo(left_offset + dep_left, top_space + dep_top);
			context.lineTo(left_offset + arr_left, top_space + arr_top);
			context.lineWidth = thick;
			context.strokeStyle = "red";
			context.stroke();
		}
	});
}

function maxCanvas() {
	console.log(window.innerWidth);
	canvas.width = window.innerWidth;
	canvas.height = h;
  scale();
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
function scale() {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  ratio = devicePixelRatio / backingStoreRatio;

  // upscale the canvas if the two ratios don't match
  if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    context.scale(ratio, ratio);
    return ratio;
  }
}
APIrequest("http://192.168.26.109/ajax/busstops.php");

function APIrequest(url) {
 function reqListener () {
     console.log(this.responseText);
 }

 var oReq = new XMLHttpRequest();
 oReq.onload = reqListener;
 oReq.open("get", url, true);
 oReq.send();
}
