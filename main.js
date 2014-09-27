var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// Haltestellen in Y Achse
// Name der Haltestelle, Entfernung vom Startpunkt in m
var ratio = 1;
var stops = undefined;

// Liste von Punkten des Diagramms
// Timestamp, Entfernung vom Startpunkt in m
var positions = undefined;


stops = JSON.parse(APIrequest("http://192.168.26.109/ajax/busstops.php?jsonp=callback").split("callback(")[1].split(")")[0]);
positions = JSON.parse(APIrequest("http://192.168.26.109/ajax/position.php?jsonp=callback").split("callback(")[1].split(")")[0]);
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
  positions = JSON.parse(APIrequest("http://192.168.26.109/ajax/position.php?jsonp=callback").split("callback(")[1].split(")")[0]);
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawTimeGrid();
  drawStopGrid();
  drawBus();
  drawRealBus();
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
  var left_offset = space + text_width - (stops[0].departuretime.hour * 60 + stops[0].departuretime.min) * time_mult;
  var top_offset = top_space;
  stops.forEach(function(stop, i) {

    if (i < stops.length-1) {
      var dep = stop;
      var arr = stops[i+1];

      var dep_left = (dep.departuretime.hour * 60 + dep.departuretime.min) * time_mult;
      var dep_top = dep.abs * length_mult;

      var arr_left = (arr.arrivaltime.hour * 60 + arr.arrivaltime.min) * time_mult;
      var arr_top = arr.abs * length_mult;

			// horizontal grid lines
			context.beginPath();
			context.moveTo(left_offset + dep_left, top_offset + dep_top);
			context.lineTo(left_offset + arr_left, top_offset + arr_top);
			context.lineWidth = thin;
			context.strokeStyle = "#000";
			context.stroke();
		}
	});
}

function drawRealBus() {
	var left_offset = space + text_width - (positions[0].hour * 60 + positions[0].min + positions[0].sec / 60) * time_mult;
	var top_offset = top_space;
	positions.forEach(function(pos, i) {
		if (positions.length > 0 && i < positions.length - 1) {
			var dep_left =  (positions[i].hour * 60 + positions[i].min + positions[i].sec / 60) * time_mult;
			var dep_top = positions[i].totalmeters * length_mult;
			var arr_left =  (positions[i + 1].hour * 60 + positions[i + 1].min + positions[i + 1].sec / 60) * time_mult;
			var arr_top = positions[i + 1].totalmeters * length_mult;

			// horizontal grid lines
			context.beginPath();
			context.moveTo(left_offset + dep_left, top_offset + dep_top);
			context.lineTo(left_offset + arr_left, top_offset + arr_top);
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

function APIrequest(url) {
 var oReq = new XMLHttpRequest();
 oReq.open("get", url, false);
 oReq.send();
 return oReq.responseText;
}
btn();

function btn() {
  var mouseX=0, mouseY=0;

  canvas.addEventListener( "mousemove", function ( e ){

    var scrollX = ( window.scrollX !== null && typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset;

    var scrollY = ( window.scrollY !== null && typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset;

    mouseX = e.clientX + scrollX;

    mouseY = e.clientY + scrollY;

  }, false );

  canvas.addEventListener( "click", function ( e ){

    if( mouseX < 200 ){

      window.location = "http://google.com";

    }

  }, false );
}
